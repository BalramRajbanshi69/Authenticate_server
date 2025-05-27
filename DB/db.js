const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const DatabaseConnection = async ()=>{
    try {
        await mongoose.connect(MONGO_URI).then(()=>{
            console.log("Database connected successfully");
        }).catch(()=>{
            console.log("Database connection failed");
        })  
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

module.exports = DatabaseConnection;