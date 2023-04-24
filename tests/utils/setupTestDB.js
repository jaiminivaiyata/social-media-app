const mongoose = require('mongoose');
const {connectDatabase} = require('../../src/general-resources/db-config');

const setupTestDB = () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany({})));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
