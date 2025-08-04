const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;
let db;

// PUBLIC_INTERFACE
/**
 * Connect to MongoDB
 * @returns {Promise<Db>}
 */
async function connectToMongo() {
  if (db) return db;
  client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
  await client.connect();
  db = client.db(process.env.MONGO_DB_NAME);
  return db;
}

// PUBLIC_INTERFACE
/**
 * Fetch the last stored data by key (e.g., group or member)
 * @param {'groups' | 'members'} key
 */
async function getStoredData(key) {
  const db = await connectToMongo();
  const collection = db.collection('state');
  const doc = await collection.findOne({ key });
  return doc ? doc.data : null;
}

// PUBLIC_INTERFACE
/**
 * Set (overwrite) stored data by key
 * @param {'groups' | 'members'} key
 * @param {object} data
 */
async function setStoredData(key, data) {
  const db = await connectToMongo();
  const collection = db.collection('state');
  await collection.updateOne(
    { key },
    { $set: { data, lastUpdated: new Date() } },
    { upsert: true }
  );
}

// PUBLIC_INTERFACE
/**
 * Get last run status
 */
async function getJobStatus() {
  const db = await connectToMongo();
  const collection = db.collection('jobStatus');
  const doc = await collection.findOne({ key: 'changeDetectionJob' });
  return doc ? doc.status : { lastRun: null, lastResult: null };
}

// PUBLIC_INTERFACE
/**
 * Set last run status
 */
async function setJobStatus(status) {
  const db = await connectToMongo();
  const collection = db.collection('jobStatus');
  await collection.updateOne(
    { key: 'changeDetectionJob' },
    { $set: { status } },
    { upsert: true }
  );
}

module.exports = {
  connectToMongo,
  getStoredData,
  setStoredData,
  getJobStatus,
  setJobStatus,
};
