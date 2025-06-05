import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
    { 
        title: {type: String, required: true},
        description: {type: String, required: true},
        options: [
            {
                text: String,
            }
        ],
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isLocked: {type: Boolean, default: false},
        createdAt: {type: Date, default: Date.now},
        expiredAt : {type: Date, default: null},        
    },
    {
        timestamps: true,
    }
);

const Poll = mongoose.model("Poll", pollSchema, "polls");

export default Poll;
