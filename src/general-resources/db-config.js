const mongoose = require("mongoose");
const config = require('./config');

const connectDatabase = async ()=>{
    const mongoConnection = await mongoose.connect(config.mongoose.url, config.mongoose.options);

    return mongoConnection;
}
const getClient = async ()=>{
    const mongoConnection = await connectDatabase()
    return mongoConnection.connection.getClient();
};


module.exports = {
    getClient,
    connectDatabase
};
