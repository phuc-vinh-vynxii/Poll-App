import Poll from '../models/poll.model.js';
import Vote from '../models/vote.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

export default class PollService {
    static async createPoll(pollData) {
        const newPoll = new Poll(pollData);
        return await newPoll.save();
    }

    static async getAllPolls({page=1,limit=10}) {
        const skip = (page - 1) * limit;

        const [polls, total] = await Promise.all([
            Poll.find()
                .skip(skip)
                .limit(limit)
                .populate('creator', '_id fullname email')
                .populate('options', 'text')
                .lean(),
            //Poll.countDocuments()
        ])

        const formattedPolls = polls.map((poll) => ({
            id: poll._id,
            title: poll.title,
            description: poll.description,
            options: poll.options.map((option) => ({
                id: option._id,
                text: option.text,
            })),
            creator: {
                id: poll.creator._id,
                fullname: poll.creator.fullname,
            },
            isLocked: poll.isLocked,
            createdAt: poll.createdAt,
            expiredAt: poll.expiredAt || null,
            votesCount: poll.votesCount || 0,
        }))
        return {
            polls: formatted,
            total,
            page,
            limit,
        }
    }

    static async getPollById(pollId) {
        const poll = await Poll.findById(pollId).popopulate('creator', '_id fullname email').lean();
        if (!poll) {
            throw new NotFoundError(`Poll with id ${pollId} not found`);
        }

        const votes = await Vote.find({pollId}).lean();

        const optionVoteMap = {};
        for (const opt of poll.options) {
            optionVoteMap[opt._id.toString()] = {
                votes: 0,
                userVote: [],
            };
        }

        for (const vote of votes) {
            const optionId = vote.optionId.toString();
            if (optionVoteMap[optionId]) {
                optionVoteMap[optionId].votes++;
                optionVoteMap[optionId].userVote.push(vote.userId.toString());
            }
        }
        const userIds = [...new Set(votes.map((v) => v.userId.toString()))];

        const users = await User.find(
        { _id: { $in: userIds } },
        "fullName _id"
        ).lean();

        const userMap = {};
        for (const u of users) {
            userMap[u._id.toString()] = {
                id: u._id,
                fullName: u.fullName,
            };
        }

        const optionsWithVotes = poll.options.map((opt) => {
            const optIdStr = opt._id.toString();
            return {
                id: opt._id,
                text: opt.text,
                votes: optionVoteMap[optIdStr]?.votes || 0,
                userVote: (optionVoteMap[optIdStr]?.userVote || []).map(
                (uid) => userMap[uid]
                ),
            };
        });

        const totalVotes = votes.length;

        return {
            id: poll._id,
            title: poll.title,
            description: poll.description,
            options: optionsWithVotes,
            creator: {
                id: poll.creator._id,
                fullName: poll.creator.fullName,
            },
            isLocked: poll.isLocked,
            createdAt: poll.createdAt,
            expiredAt: poll.expiredAt || null,
            votesCount: totalVotes,
        }
    }

    static async addOption(pollId, text) {
        return await Poll.findByIdAndUpdate(
            pollId,
            {
                $push: {options: {text: text}},
            },
            {new: true}
        )
    }

    static async removeOption(pollId, optionId) {
        return await Poll.findByIdAndUpdate(
            pollId,
            {
                $pull: {options: {_id: optionId}},
            },
            {new: true}
        )
    }

    static async lockPoll(pollId) {
        return await Poll.findByIdAndUpdate(
            pollId,
            {isLocked: true},
            {new: true}
        );
    }

    static async unlockPoll(pollId) {
        return await Poll.findByIdAndUpdate(
            pollId,
            {isLocked: false},
            {new: true}
        );
    }
}