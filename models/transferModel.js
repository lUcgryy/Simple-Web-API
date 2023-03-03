const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    time: {
        type: Date,
        default: Date.now(),
    },
    amount: {
        type: Number,
        min: [1, "Amount must be greater than 0"],
    },
    note: {
        type: String,
        maxlength: [100, "A transfer note must have less or equal than 100 characters"],
    },
});

const Transfer = mongoose.model("Transfer", transferSchema);
module.exports = Transfer;