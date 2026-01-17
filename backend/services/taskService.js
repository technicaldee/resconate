const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const escrowService = require('./escrowService');
const walletService = require('./walletService');

class TaskService {
    /**
     * Create a new task in DRAFT
     */
    async createTask(data) {
        const {
            poster_id, poster_type, title, description,
            required_skills, total_slots, pay_per_slot,
            deadline, type, visibility
        } = data;

        return await prisma.tasks.create({
            data: {
                poster_id,
                poster_type,
                title,
                description,
                required_skills: Array.isArray(required_skills) ? required_skills : [required_skills],
                total_slots: parseInt(total_slots),
                pay_per_slot: parseFloat(pay_per_slot),
                deadline: new Date(deadline),
                type: type || 'FIXED', // FIXED or COMPETITION
                visibility: visibility || 'PUBLIC',
                status: 'DRAFT'
            }
        });
    }

    /**
     * Claim a slot in a task
     */
    async claimTask(taskId, earnerId) {
        return await prisma.$transaction(async (tx) => {
            // 1. Check task
            const task = await tx.tasks.findUnique({
                where: { id: taskId },
                lock: { mode: 'update' } // Prevent race conditions on filled_slots
            });

            if (!task || task.status !== 'ACTIVE') {
                throw new Error('Task is not active or not found');
            }

            if (task.filled_slots >= task.total_slots) {
                throw new Error('Task slots are fully filled');
            }

            // 2. Check earner verification
            const earner = await tx.public_earners.findUnique({ where: { id: earnerId } });
            if (!earner || !earner.is_verified) {
                throw new Error('Earner must be verified to claim tasks');
            }

            // 3. Prevent duplicate claims
            const existingClaim = await tx.task_claims.findUnique({
                where: { task_id_earner_id: { task_id: taskId, earner_id: earnerId } }
            });
            if (existingClaim) {
                throw new Error('You have already claimed this task');
            }

            // 4. Create claim
            const claim = await tx.task_claims.create({
                data: {
                    task_id: taskId,
                    earner_id: earnerId,
                    status: 'CLAIMED'
                }
            });

            // 5. Update task
            const updatedTask = await tx.tasks.update({
                where: { id: taskId },
                data: {
                    filled_slots: { increment: 1 },
                    status: task.filled_slots + 1 >= task.total_slots ? 'IN_PROGRESS' : 'ACTIVE'
                }
            });

            // 6. Add to pending balance in wallet
            await walletService.addPending(
                earnerId,
                task.pay_per_slot,
                `Escrow pending for task: ${task.title}`,
                claim.id
            );

            return claim;
        });
    }

    /**
     * Submit work for a claimed task
     */
    async submitWork(claimId, submissionUrl) {
        return await prisma.task_claims.update({
            where: { id: claimId },
            data: {
                status: 'SUBMITTED',
                submission_url: submissionUrl,
                submitted_at: new Date()
            }
        });
    }

    /**
     * Approve a submission
     */
    async approveClaim(claimId, posterId) {
        return await prisma.$transaction(async (tx) => {
            const claim = await tx.task_claims.findUnique({
                where: { id: claimId },
                include: { task: true }
            });

            if (!claim || claim.status !== 'SUBMITTED') {
                throw new Error('Submission not found or not in correct state');
            }

            if (claim.task.poster_id !== posterId) {
                throw new Error('Unauthorized');
            }

            // 1. Update claim status
            await tx.task_claims.update({
                where: { id: claimId },
                data: { status: 'APPROVED' }
            });

            // 2. Trigger payment release via Escrow Service
            await escrowService.releasePayment(claim.task_id, claim.earner_id, claimId);

            return { success: true };
        });
    }

    /**
     * Reject a submission
     */
    async rejectClaim(claimId, posterId, reason) {
        return await prisma.$transaction(async (tx) => {
            const claim = await tx.task_claims.findUnique({
                where: { id: claimId },
                include: { task: true }
            });

            if (!claim || claim.status !== 'SUBMITTED') {
                throw new Error('Submission not found');
            }

            if (claim.task.poster_id !== posterId) {
                throw new Error('Unauthorized');
            }

            // 1. Update status
            await tx.task_claims.update({
                where: { id: claimId },
                data: { status: 'REJECTED' }
            });

            // 2. Decrement pending balance (money stays in escrow for now or re-assigned)
            // In a real flow, you might want to open the task slot again
            await tx.wallets.update({
                where: { owner_id: claim.earner_id },
                data: { pending_balance: { decrement: claim.task.pay_per_slot } }
            });

            // Optional: Re-open slot
            await tx.tasks.update({
                where: { id: claim.task_id },
                data: {
                    filled_slots: { decrement: 1 },
                    status: 'ACTIVE'
                }
            });

            return { success: true };
        });
    }
}

module.exports = new TaskService();
