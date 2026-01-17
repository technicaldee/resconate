const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/balance', walletController.getBalance);
router.get('/transactions', walletController.getTransactions);
router.post('/withdraw', walletController.requestWithdrawal);
router.post('/topup', walletController.topupWallet);

module.exports = router;
