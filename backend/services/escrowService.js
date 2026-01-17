const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const walletService = require('./walletService');

class EscrowService {
    /**
     * Initialize escrow for a task
     */
    async fundTask(taskId, posterId, taskBudget, platformFee) {
        const totalAmount = parseFloat(taskBudget) + parseFloat(platformFee);

        return await prisma.$transaction(async (tx) => {
            // 1. Check if task exists and is in DRAFT
            const task = await tx.tasks.findUnique({ where: { id: taskId } });
            if (!task || task.status !== 'DRAFT') {
                throw new Error('Task not found or already funded');
            }

            // 2. Debit poster's wallet
            const posterWallet = await tx.wallets.findUnique({
                where: { owner_id: posterId }
            });

            if (!posterWallet || posterWallet.available_balance < totalAmount) {
                throw new Error('Insufficient wallet balance to fund task');
            }

            await tx.wallets.update({
                where: { id: posterWallet.id },
                data: { available_balance: { decrement: totalAmount } }
            });

            // 3. Create Escrow record
            const escrow = await tx.task_escrow.create({
                data: {
                    task_id: taskId,
                    total_deposited: totalAmount,
                    task_budget: taskBudget,
                    platform_fee: platformFee,
                    status: 'HELD'
                }
            });

            // 4. Update Task status
            await tx.tasks.update({
                where: { id: taskId },
                data: { status: 'ACTIVE' }
            });

            // 5. Log transaction
            await tx.wallet_transactions.create({
                data: {
                    wallet_id: posterWallet.id,
                    type: 'ESCROW_FUND',
                    amount: totalAmount,
                    description: `Funded task: ${task.title}`,
                    reference_id: taskId
                }
            });

            return escrow;
        });
    }

    /**
     * Release funds to an earner
     */
    async releasePayment(taskId, earnerId, claimId) {
        return await prisma.$transaction(async (tx) => {
            const escrow = await tx.task_escrow.findUnique({
                where: { task_id: taskId },
                include: { task: true }
            });

            if (!escrow || escrow.status !== 'HELD') {
                throw new Error('Escrow not found or already released');
            }

            const payAmount = escrow.task.pay_per_slot;

            // 1. Credit earner's wallet (move from pending to available)
            const earnerWallet = await tx.wallets.findUnique({
                where: { owner_id: earnerId }
            });

            if (!earnerWallet) {
                throw new Error('Earner wallet not found');
            }

            await tx.wallets.update({
                where: { id: earnerWallet.id },
                data: {
                    pending_balance: { decrement: payAmount },
                    available_balance: { increment: payAmount }
                }
            });

            // 2. Handle Partner Commission
            const earner = await tx.public_earners.findUnique({
                where: { id: earnerId },
                include: { squad_membership: true }
            });

            if (earner.squad_membership) {
                const commission = parseFloat(payAmount) * 0.05; // 5% commission
                const partner = await tx.partners.findUnique({
                    where: { id: earner.squad_membership.partner_id }
                });

                if (partner) {
                    const partnerWallet = await tx.wallets.findUnique({
                        where: { owner_id: partner.id } // Note: Check if partner owner_id logic follows this pattern
                    });

                    if (partnerWallet) {
                        await tx.wallets.update({
                            where: { id: partnerWallet.id },
                            data: { available_balance: { increment: commission } }
                        });

                        await tx.wallet_transactions.create({
                            data: {
                                wallet_id: partnerWallet.id,
                                type: 'COMMISSION',
                                amount: commission,
                                description: `Commission from squad member: ${earner.full_name}`,
                                reference_id: claimId
                            }
                        });

                        await tx.partners.update({
                            where: { id: partner.id },
                            data: { total_commission_earned: { increment: commission } }
                        });
                    }
                }
            }

            // 3. Update claim and escrow records
            await tx.task_claims.update({
                where: { id: claimId },
                data: { payout_status: 'COMPLETED' }
            });

            await tx.task_escrow.update({
                where: { task_id: taskId },
                data: { amount_paid_out: { increment: payAmount } }
            });

            // Update earner stats
            await tx.public_earners.update({
                where: { id: earnerId },
                data: {
                    total_earnings: { increment: payAmount }
                }
            });

            return { success: true };
        });
    }
}

module.exports = new EscrowService();
