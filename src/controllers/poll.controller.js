import PollService from '../services/poll.service.js';
import Poll from '../models/poll.model.js';
import { BadRequestError, AuthFailureError, ConflictRequestError, } from '../handlers/error.response.js';

export default class PollController {
    static async createPoll(req, res) {
        const { title, description, options } = req.body;

        if (!title || !description || typeof title !== "string" || title.trim() === "") {
            throw new BadRequestError('Invalid poll data');
        }

        if (!req.userId) {
            throw new AuthFailureError('Unauthorized: User not authenticated');
        }

        const existing = await Poll.findOne({ title });
        if (existing) {
            throw new ConflictRequestError("Poll with this title already exists");
        }

        const newPoll = await PollService.createPoll({
            title,
            description,
            creator: req.user.id,
            options,
        });

        res.status(201).json(newPoll);
    }

    static async getAllPolls(req, res) {
        const { page = 1, limit = 10 } = req.query;
        const polls = await PollService.getAllPolls({ page, limit });

        res.json({
            success: true,
            message: "Get all Poll successfully",
            data: polls,
            total: polls.length,
            page,
            limit,
        });
    }

    static async getPollById(req, res) {
        const {id} = req.params;
        const poll = await PollService.getPollById(id);
        if (!poll) {
            return res.status(404).json({
                success: false,
                message: "Poll not found",
                poll: poll
            });
        }
        res.json({
            success: true,
            message: "Get Poll successfully",
            data: poll,
        });
    }

    static async addOption(req, res) {
        const { pollId } = req.params;
        const { text } = req.body;
        const updated = await PollService.addOption(pollId, text);
        res.json(updated);
    }

    static async removeOption(req, res) {
        const { pollId, optionId } = req.params;
        const updatedPoll = await PollService.removeOption(pollId, optionId);
        if (!updatedPoll) {
            return res.status(404).json({ message: "Poll not found" });
        }
        res.json(updatedPoll);
    }

    static async lockPoll(req, res) {
        const { pollId } = req.params;
        const updated = await PollService.lockPoll(pollId);
        res.json(updated);
    }

    static async unlockPoll(req, res) {
        const { pollId } = req.params;
        const updated = await PollService.unlockPoll(pollId);
        res.json(updated);
    }
}