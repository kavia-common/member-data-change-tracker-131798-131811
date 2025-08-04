const _ = require('lodash');

// PUBLIC_INTERFACE
/**
 * Detect differences between previous and current data
 * @param {array} prevArr
 * @param {array} currArr
 * @param {string} keyField
 * @returns {object} Detected changes: { added, removed, updated }
 */
function detectChanges(prevArr, currArr, keyField='id') {
  const prevMap = Object.fromEntries((prevArr || []).map(item => [item[keyField], item]));
  const currMap = Object.fromEntries((currArr || []).map(item => [item[keyField], item]));

  const added = [];
  const removed = [];
  const updated = [];

  for (const key in currMap) {
    if (!prevMap[key]) {
      added.push(currMap[key]);
    } else if (!_.isEqual(prevMap[key], currMap[key])) {
      updated.push({ before: prevMap[key], after: currMap[key] });
    }
  }
  for (const key in prevMap) {
    if (!currMap[key]) {
      removed.push(prevMap[key]);
    }
  }
  return { added, removed, updated };
}

module.exports = { detectChanges };
