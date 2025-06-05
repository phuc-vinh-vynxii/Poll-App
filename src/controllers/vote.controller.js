import VoteService from '../services/vote.service.js';

export default class VoteController {
    static async createVote(req, res) {
        const {pollId, optionId} = req.body;
        const userId = req.userId;

        const vote = await VoteService.createVote({
            userId,
            pollId,
            optionId,
        });
        return res.status(201).json({ message: "Vote created", vote });
    }

    static async deleteVote(req, res) {
        const {pollId} = req.body;
        const userId = req.userId;

        const deleted = await VoteService.deleteVote({ userId, pollId });
        if (!deleted) return res.status(404).json({ message: "Vote not found" });

        return res.status(200).json({ message: "Vote deleted" });
    }
}