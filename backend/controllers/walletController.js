const walletService = require('../services/walletService');

exports.getBalance = async (req, res) => {
    try {
        const { ownerId } = req.query; // In real app, from req.user
        const balance = await walletService.getBalance(ownerId);
        res.json({ success: true, data: balance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { ownerId } = req.query;
        const transactions = await walletService.getTransactions(ownerId);
        res.json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.requestWithdrawal = async (req, res) => {
    try {
        const { ownerId, amount, bankDetails } = req.body;
        const withdrawal = await walletService.requestWithdrawal(ownerId, amount, bankDetails);
        res.json({ success: true, data: withdrawal });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.topupWallet = async (req, res) => {
    try {
        const { ownerId, amount, description, referenceId } = req.body;
        // Note: In real app, this should only be called after verifying Paystack webhook/ref
        const wallet = await walletService.deposit(ownerId, amount, description, referenceId);
        res.json({ success: true, data: wallet });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
