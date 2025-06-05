import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        pollId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Poll',
            required: true,
        },
        optionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

voteSchema.index({ userId: 1, pollId: 1 }, { unique: true }); // 1 user vote 1 lan
const Vote = mongoose.model('Vote', voteSchema);
export default Vote;