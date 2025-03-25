const {MongoClient} = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const users = db.collection('users');
const groups = db.collection('groups');

(async function testConnection() {
  try {
    await db.command({ ping: 1});
    console.log("Connected to database");
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUserByUsername(username) {
  return users.findOne({username: username});
}

function getUserByToken(token) {
  return users.findOne({token: token});
}
