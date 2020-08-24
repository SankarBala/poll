const Poll = require("../models/Poll");

exports.createPollGetController = (req, res, next) => {
    res.render("createPoll");
};

exports.createPollPostController = async (req, res, next) => {
    let { title, description, options } = req.body;
    options = options.map((obj) => {
        return {
            name: obj,
            vote: null,
        };
    });

    let poll = new Poll({
        title,
        description,
        options,
    });

    try {
        await poll.save();
        res.redirect("/polls");
    } catch (e) {
        console.log(e);
        res.redirect("/faild");
    }
};

exports.getAllPolls = async (req, res, next) => {
    try {
        let polls = await Poll.find();
        res.render("polls", { polls });
    } catch (e) {
        console.log(e);
    }
};

exports.getSinglePoll = async (req, res, next) => {
    let id = req.params.id;
    try {
        let poll = await Poll.findById(id);
        let options = [...poll.options];

        let result = [];
        options.forEach(option => {
            let percentage = (option.vote * 1) / poll.totalVote;
            result.push({
                ...option._doc,
                percentage: percentage ? percentage : 0
            })
        })
        res.render("poll", { poll, result });
    } catch (e) {
        console.log(e);
    }
};

exports.postOpinion = async (req, res, next) => {
    let id = req.params.id;
    let optionId = req.body.option.replace(/\s/g, "");

    try {
        let poll = await Poll.findById(id);
        let options = [...poll.options];

        let index = options.findIndex((o) => o.id == optionId);
        options[index].vote = options[index].vote + 1;
        let totalVote = poll.totalVote + 1;

        await Poll.findOneAndUpdate(
            {
                _id: poll._id,
            },
            {
                $set: {
                    options,
                    totalVote,
                },
            }
        );

        res.redirect("/poll/" + id);
    } catch (e) {
        console.log(e);
    }
};
