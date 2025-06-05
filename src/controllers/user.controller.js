import UserService from '../services/user.service.js';
import { BadRequestError, NotFoundError } from '../handlers/error.response.js';

export default class UserController {
    static async getAllUsers(req, res) {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    }

    static async getUserById(req, res) {
        const user = await UserService.getUserById(req.params.id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        res.status(200).json(user);
    }

    static async createUser(req, res) {
        const { fullName, address, email, gender, phone, age } = req.body;

        if (!fullName || !address || !email || !gender || !phone || !age) {
            throw new BadRequestError("Please provide all required fields: fullName, address, email, gender, phone, age");
        }

        const user = await UserService.createUser({
            fullName,
            address,
            email,
            gender,
            phone,
            age,
        });

        res.status(201).json({ message: "User created successfully", user });
    }

    static async updateUser(req, res) {
        // const { fullName, address, email, gender, phone, age } = req.body;

        // if (!fullName || !address || !email || !gender || !phone || !age) {
        //     throw new BadRequestError("Please provide all required fields");
        // }

        const user = await UserService.updateUser(req.params.id, req.body);

        if (!user) throw new NotFoundError("User not found");

        res.status(200).json({ message: "Update successful", user });
    }

    static async deleteUser(req, res) {
        const user = await UserService.deleteUser(req.params.id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
}