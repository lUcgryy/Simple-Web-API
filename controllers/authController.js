const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

const createAccessToken = id => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACESSS_EXPIRES_IN
    });
};

const createRefreshToken = id => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    });
};

login = async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        // 1) Check if username and password exist
        if (!username || !password) {
            return next(new AppError(400, 'fail', 'Please provide username and password'), req, res, next);
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ username: username }).select('+password');
        if (!user || !(await user.checkPassword(password, user.password))) {
            return next(new AppError(401, 'fail', 'Incorrect username or password'), req, res, next);
        }

        // 3) If everything ok, send token pair to client
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        // Remove password from output
        user.password = undefined;
        userId = user._id;
        const newUser = await User.findById(userId).populate('hasBought.item').populate('vip');
        res.status(201).json({
            status: 'success',
            accessToken: accessToken,
            refreshToken: refreshToken,
            data: newUser
        });
    } catch (err) {
        next(err);
    }
};

register = async (req, res, next) => {
    try {
        email = req.body.email;
        username = req.body.username;
        password = req.body.password;
        passwordConfirm = req.body.passwordConfirm;
        // 1) Check if username, email, and password is empty
        if (!username || !password || !passwordConfirm || !email) {
            return next(new AppError(400, 'fail', 'Please provide username and password'), req, res, next);
        }
        // 2) Check if username or email exists
        const checkUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        }).select('username');
        if (checkUser) {
            return next(new AppError(400, 'fail', 'Username or email already exists'), req, res, next);
        }
        // 3) Check if password and passwordConfirm match
        if (password !== passwordConfirm) {
            return next(new AppError(400, 'fail', 'Passwords do not match'), req, res, next);
        }
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });

        user.password = undefined;
        userId = user._id;
        const newUser = await User.findById(userId).populate('hasBought.item').populate('vip').select('+resetToken');
        res.status(201).json({
            status: 'success',
            data: newUser
        });
    } catch (err) {
        next(err);
    }
};

changePassword = async (req, res, next) => {
    try {
        // check password exists
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;
        if (!oldPassword || !newPassword || !confirmPassword) {
            return next(new AppError(400, 'fail', 'Please provide password and confirm password'), req, res, next);
        }
        // check password match
        const user = await User.findById(req.user.id).select('+password');
        if (!(await user.checkPassword(oldPassword, user.password))) {
            return next(new AppError(401, 'fail', 'Incorrect password'), req, res, next);
        }
        // check new password and confirm password match
        if (newPassword !== confirmPassword) {
            return next(new AppError(400, 'fail', 'Passwords do not match'), req, res, next);
        }
        // update password
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

resetPassword = async (req, res, next) => {
    try {
        const username = req.body.username;
        const resetToken = req.body.resetToken;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;
        // 1) Check if username, resetToken, newPassword, and confirmPassword is empty
        if (!username || !resetToken || !newPassword || !confirmPassword) {
            return next(new AppError(400, 'fail', 'Please provide all required information'), req, res, next);
        }
        // 2) Check for valid username and resetToken
        const user = await User.findOne({ username: username }).select('+resetToken +password');
        if (!user || resetToken !== user.resetToken ) {
            return next(new AppError(400, 'fail', 'Invalid username or reset token'), req, res, next);
        }
        // 3) Check if newPassword and confirmPassword match
        if (newPassword !== confirmPassword) {
            return next(new AppError(400, 'fail', 'Passwords do not match'), req, res, next);
        }
        // 4) Update password
        user.password = newPassword;
        user.activeToken = true;
        await user.save();
        // 5) Remove sensitive data from output
        user.resetToken = undefined;
        user.password = undefined;
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (err) {
        next(err);
    }
};

refreshToken = async (req, res, next) => {
    try {
        // 1) Getting token and check of it's there
        let refreshToken;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            refreshToken = req.headers.authorization.split(' ')[1];
        }

        if (!refreshToken) {
            return next(new AppError(401, 'fail', 'You are not logged in! Please log in to get access.'), req, res, next);
        }

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError(401, 'fail', 'The user belonging to this token does no longer exist.'), req, res, next);
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        const accessToken = createAccessToken(currentUser._id);
        res.status(200).json({
            status: 'success',
            accessToken: accessToken
        });
    } catch (err) {
        next(err);
    }
};


protect = async (req, res, next) => {
    try {
        // 1) Getting token and check of it's there
        let accessToken;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            accessToken = req.headers.authorization.split(' ')[1];
        } 

        if (!accessToken) {
            return next(new AppError(401, 'fail', 'You are not logged in! Please log in to get access.'), req, res, next);
        }

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(accessToken, process.env.JWT_ACCESS_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError(401, 'fail', 'The user belonging to this token does no longer exist.'), req, res, next);
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (err) {
        next(err);
    }
};

restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, 'fail', 'You do not have permission to perform this action'), req, res, next);
        }
        next();
    };
};

module.exports = {
    login,
    register,
    changePassword,
    resetPassword,
    refreshToken,
    protect,
    restrictTo
};