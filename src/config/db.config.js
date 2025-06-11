import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectionString = process.env.MONGODB_URI;

class Database {
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      console.log("MONGODB_URI:", connectionString);
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
      await mongoose.connect(connectionString);

      console.log("MongoDB connected");
    } catch (error) {
      console.log("MongoDB connection error:", error.message);
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
export default instanceMongoDB;
