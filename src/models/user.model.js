import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true },
        address: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        gender: { type: String },
        phone: { type: String },
        age: { type: Number },
        otp: { type: String },
        otpExpires: { type: Date },
        role:  { type: String, enum: ['user', 'admin'], default: 'user' , required: true },
    }
);

const User = mongoose.model("User", userSchema, "users");
export default User;