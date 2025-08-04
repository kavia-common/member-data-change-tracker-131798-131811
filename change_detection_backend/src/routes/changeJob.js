const express = require('express');
const { jobStatus, triggerJob } = require('../controllers/job');

const router = express.Router();

/**
 * @swagger
 * /job/status:
 *   get:
 *     summary: Get job status
 *     description: Returns information about the last scheduled change detection job run
 *     tags:
 *       - ChangeJob
 *     responses:
 *       200:
 *         description: Status retrieved
 */
router.get('/status', jobStatus);

/**
 * @swagger
 * /job/trigger:
 *   post:
 *     summary: Manually trigger change detection job
 *     description: Triggers the change detection job outside its normal schedule
 *     tags:
 *       - ChangeJob
 *     responses:
 *       200:
 *         description: Job completed
 *       500:
 *         description: Job error
 */
router.post('/trigger', triggerJob);

module.exports = router;
