const mongoose =  require ("mongoose");
require("dotenv").config();


const connectDB = async () => {
    mongoose.connection.on("connected",()=>{
        console.log("Database Connected")
    });

    await mongoose.connect(`${process.env.MONGOURL}/ArtifyAI`)
}

module.exports = {
    connectDB
}