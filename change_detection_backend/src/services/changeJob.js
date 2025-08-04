/**
 * Orchestrates the scheduled (and manual) change detection job
 */
const { fetchResource } = require('./fetchApi');
const { getStoredData, setStoredData, setJobStatus, getJobStatus } = require('./db');
const { detectChanges } = require('./changeDetection');
const { notifyAll } = require('./notifier');

async function processAndDetect(resourceName, keyField='id') {
  const prev = await getStoredData(resourceName) || [];
  const curr = await fetchResource(resourceName);

  const diff = detectChanges(prev, curr, keyField);
  await setStoredData(resourceName, curr);

  return diff;
}

// PUBLIC_INTERFACE
/**
 * Runs the change detection job for all resources
 */
async function runChangeDetectionJob() {
  const startedAt = new Date();
  let groupsChanges = {}, membersChanges = {}, status, message;

  try {
    groupsChanges = await processAndDetect('groups');
    membersChanges = await processAndDetect('members');

    // Only notify if actual changes found
    if (
      groupsChanges.added.length ||
      groupsChanges.removed.length ||
      groupsChanges.updated.length ||
      membersChanges.added.length ||
      membersChanges.removed.length ||
      membersChanges.updated.length
    ) {
      // Format notification message
      const summary = [
        ...[
          groupsChanges.added.length && `Groups added: ${groupsChanges.added.length}`,
          groupsChanges.removed.length && `Groups removed: ${groupsChanges.removed.length}`,
          groupsChanges.updated.length && `Groups updated: ${groupsChanges.updated.length}`
        ].filter(Boolean),
        ...[
          membersChanges.added.length && `Members added: ${membersChanges.added.length}`,
          membersChanges.removed.length && `Members removed: ${membersChanges.removed.length}`,
          membersChanges.updated.length && `Members updated: ${membersChanges.updated.length}`
        ].filter(Boolean),
      ].join(', ');

      await notifyAll(
        'Change Detected in Members or Groups',
        summary,
        `<h3>Detected changes</h3><pre>${summary}</pre>`
      );
      message = `Job completed: ${summary}`;
    } else {
      message = 'No changes detected.';
    }
    status = 'OK';
  } catch (e) {
    status = 'ERROR';
    message = `Error: ${e.message}`;
  }
  // Store run status
  await setJobStatus({
    lastRun: startedAt,
    status,
    message
  });

  return { status, message, groupsChanges, membersChanges, startedAt };
}

// PUBLIC_INTERFACE
async function getStatus() {
  return await getJobStatus();
}

module.exports = {
  runChangeDetectionJob,
  getStatus
};
