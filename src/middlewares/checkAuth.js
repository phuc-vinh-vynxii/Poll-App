import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

class CheckAuth {
    static checkAuth = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            const user = await userAccount.findById(decoded.userId);

            if (!user){
                return res.status(404).json({message: 'User not found'})
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({message: 'Unauthorized'})
        }
    }
    //hạn chế query db bằng middlewares (chỉ nên validate, log,...)
}

export default CheckAuth;
