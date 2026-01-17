const taskService = require('../services/taskService');
const escrowService = require('../services/escrowService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTasks = async (req, res) => {
    try {
        const { skills, minPay, type } = req.query;

        const where = {
            status: 'ACTIVE',
            visibility: 'PUBLIC'
        };

        if (skills) {
            where.required_skills = { hasSome: skills.split(',') };
        }

        if (minPay) {
            where.pay_per_slot = { gte: parseFloat(minPay) };
        }

        if (type && type !== 'All') {
            where.type = type.toUpperCase();
        }

        const tasks = await prisma.tasks.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: { claims: true }
                }
            }
        });

        res.json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await prisma.tasks.findUnique({
            where: { id: req.params.id },
            include: {
                _count: { select: { claims: true } }
            }
        });

        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        // Note: In real app, poster_id comes from req.user
        const task = await taskService.createTask(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.claimTask = async (req, res) => {
    try {
        const { earnerId } = req.body; // In real app, from req.user
        const claim = await taskService.claimTask(req.params.id, earnerId);
        res.json({ success: true, data: claim });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.submitTaskWork = async (req, res) => {
    try {
        const { claimId, submissionUrl } = req.body;
        const submission = await taskService.submitWork(claimId, submissionUrl);
        res.json({ success: true, data: submission });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.reviewTaskClaim = async (req, res) => {
    try {
        const { claimId, status, posterId, reason } = req.body;

        if (status === 'APPROVE') {
            await taskService.approveClaim(claimId, posterId);
        } else {
            await taskService.rejectClaim(claimId, posterId, reason);
        }

        res.json({ success: true, message: `Claim ${status.toLowerCase()}d successfully` });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.fundTaskEscrow = async (req, res) => {
    try {
        const { posterId, taskBudget, platformFee } = req.body;
        const escrow = await escrowService.fundTask(req.params.id, posterId, taskBudget, platformFee);
        res.json({ success: true, data: escrow });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
