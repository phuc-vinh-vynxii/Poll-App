import User from "../models/user.model.js";

class UserValidator {
    checkUserValidate = async (req, res, next) => {
        const user = req.body;
        if (user) {
        if (!user.name) {
            console.log("Name is required");
            res.status(400).send({ status: false, message: "Name is required" });
            return;
        } else {
            if (user.name.trim().length < 10) {
            res
                .status(400)
                .send({
                status: false,
                message: "Name must be at least 10 characters",
                });
            return;
            }
        }
        }
        if (user) {
            let id = "";
        if (user.email) {
            if (req.params.id) {
                id = req.params.id;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const checkEmail = emailRegex.test(user.email);
            if (!checkEmail) {
                res.status(400).send({ status: false, message: "Email is invalid" });
                return;
            }
            if (id !== "") {
                const existingUser = await User.findOne({
                    email: user.email,
                    _id: { $ne: id },
            });
            if (existingUser) {
                res
                .status(400)
                .send({ status: false, message: "Email already exists" });
                return;
            }
            } else {
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
                res
                .status(400)
                .send({ status: false, message: "Email already exists" });
                return;
            }
            }
        } else {
            res.status(400).send({ status: false, message: "Email is required" });
            return;
        }
        }

        if (user) {
        if (user.age) {
            const age = parseInt(user.age);
            if (isNaN(age) || age <= 0 || age > 100) {
            res.status(400).send({ status: false, message: "Age is invalid" });
            return;
            }
        } else {
            res.status(400).send({ status: false, message: "Age is required" });
            return;
        }
        }
        next();
    };
    }

export default UserValidator;
