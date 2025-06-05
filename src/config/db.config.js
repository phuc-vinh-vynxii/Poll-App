import mongoose from 'mongoose';
import Vote from '../models/vote.model.js';

const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
        await Vote.createIndexes();
        console.log("Indexes created for Vote model");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
