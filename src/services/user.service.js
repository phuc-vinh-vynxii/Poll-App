import User from "../models/user.model.js";

export default class UserService {
    static async getAllUsers() {
        return await User.find();
    }

    static async getUserById(userId) {
        return await User.findById(userId);
    }

    static async createUser(userData) {
        const newUser = new User(userData);
        return await newUser.save();
    }

    static async updateUser(userId, userData) {
        return await User.findByIdAndUpdate(userId, userData, { new: true }); 
    }

    static async deleteUser(userId) {
        return await User.findByIdAndDelete(userId); 
    }
}