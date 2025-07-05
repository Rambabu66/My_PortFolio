const mongoose = require('mongoose');

const connectedDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.Mongo_Api);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectedDB;
