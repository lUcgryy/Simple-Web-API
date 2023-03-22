const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const buySchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
    },
    time: {
        type: Date,
        default: Date.now(),
    },
    quantity: {
        type: Number,
        min: [1, "Quantity must be greater than 0"],
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
        trim: true,
        maxlength: [40, "A user name must have less or equal than 40 characters"],
    },
    email: {
        type: String,
        required: [true, "Please fill your email!"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    avatar: {
        type: String,
        default: "/images/default.png",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    phone: {
        type: String,
        trim: true,
        default: "",
        maxlength: [11, "A user phone number must have less or equal than 11 characters"],
        validate: (value) => {return validator.isMobilePhone(value) || validator.isEmpty(value)},
        message: "Please provide a valid phone number"

    },
    username: {
        type: String,
        required: [true, "Please fill your username!"],
        unique: true,
        trim: true,
        maxlength: [40, "A user username must have less or equal than 40 characters"],
    },
    password: {
        type: String,
        required: [true, "Please fill your password!"],
        minlength: [6, "A user password must have more or equal than 6 characters"],
        select: false,
    },
    money: {
        type: Number,
        default: 0,
        min: [0, "Money must be greater than 0"],
    },
    hasBought: [buySchema],
    vip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vip",
    },
    expireDay: {
        type: Date,
    },
    resetToken: {
        type: String,
        select: false
    }
});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
    // Create reset token
    this.resetToken = crypto.randomBytes(8).toString("hex");
    // Only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    // Hash the password
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.checkPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;