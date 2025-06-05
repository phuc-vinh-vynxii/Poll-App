import Vote from "../models/vote.model.js";
import Poll from "../models/poll.model.js";

export default class VoteService {
    static async createVote({ userId, pollId, optionId }) {
        const poll = await Poll.findById(pollId);
        if (!poll) throw new Error("Poll not found");
        if (poll.isLocked) throw new Error("Poll is locked");

        return await Vote.create({ userId, pollId, optionId });
    }

    static async deleteVote({ userId, pollId }) {
        const poll = await Poll.findById(pollId);
        if (!poll) throw new Error("Poll not found");
        if (poll.isLocked) throw new Error("Poll is locked");

        return await Vote.findOneAndDelete({ userId, pollId });
    }
}