const { runChangeDetectionJob, getStatus } = require('../services/changeJob');

// PUBLIC_INTERFACE
/**
 * Report job status
 */
async function jobStatus(req, res) {
  const status = await getStatus();
  return res.status(200).json(status);
}

// PUBLIC_INTERFACE
/**
 * Manually trigger job run
 */
async function triggerJob(req, res) {
  const result = await runChangeDetectionJob();
  return res.status(result.status === 'OK' ? 200 : 500).json(result);
}

module.exports = {
  jobStatus,
  triggerJob,
};
