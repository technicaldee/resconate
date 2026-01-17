const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

// Task Routes
router.get('/tasks', marketplaceController.getAllTasks);
router.get('/tasks/:id', marketplaceController.getTaskById);
router.post('/tasks', marketplaceController.createTask);
router.post('/tasks/:id/claim', marketplaceController.claimTask);
router.post('/tasks/:id/submit', marketplaceController.submitTaskWork);
router.post('/tasks/:id/review', marketplaceController.reviewTaskClaim);
router.post('/tasks/:id/fund', marketplaceController.fundTaskEscrow);

module.exports = router;
