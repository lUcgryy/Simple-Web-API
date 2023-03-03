const mongoose = require("mongoose");

const vipSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "Please enter the type of the vip"],
    },
    price: {
        type: Number,
        required: [true, "Please enter the price of the vip"],
    },
    description: {
        type: String,
        default: "You will get 30% discount on all items",
    },
    discount: {
        type: Number,
        default: 0.3,
        required: [true, "Please enter the discount of the vip"],
        min: [0, "Discount must be greater than 0"],
        max: [1, "Discount must be less than 1"],
    },
    duration: {
        type: Number,
        required: [true, "Please enter the duration of the vip (in months)"],
    },
});

const Vip = mongoose.model("Vip", vipSchema);
module.exports = Vip;