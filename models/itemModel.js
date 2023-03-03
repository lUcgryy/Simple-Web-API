const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please fill the name!"],
        trim: true,
        maxlength: [40, "A item name must have less or equal than 40 characters"],
    },
    description: {
        type: String,
        required: [true, "Please fill the description!"],
        trim: true,
        maxlength: [100, "A item description must have less or equal than 100 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please fill the price!"],
        min: [0, "Price must be greater than 0"],
    },
    amount: {
        type: Number,
        required: [true, "Please fill the quantity!"],
        min: [0, "Quantity must be positive"],
    },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;