const User = require('../models/userModel');
const Item = require('../models/itemModel');
const Vip = require('../models/vipModel');
const Transfer = require('../models/transferModel');
const base = require("./baseController");
const AppError = require('../utils/appError');
const upload = require('../utils/upload');
const validator = require("validator");


function addMonth(date, month) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + month);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
}

function isVipExpired(User) {
    if (User.vip) {
        if (User.vip.expiredAt < Date.now()) {
            return true;
        }
    }
    return false;
}

getCurrentUser = async (req, res, next) => {
    try {
        let query = User.findById(req.user.id);
        query = query.populate('hasBought');
        if (req.user.vip) query = query.populate('vip');
        const data = await query;

        if (!data) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
};

updateCurrentUser = async (req, res, next) => {
    try {
        // check email exists
        const checkUser = await User.findOne({
            email: req.body.email
        }).select('email');
        if (checkUser) {
            return next(new AppError(400, 'fail', 'Email already exists'), req, res, next);
        }
        // handle null data
        var updateData = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.phone) updateData.phone = req.body.phone;
        // update
        const data = await User.findByIdAndUpdate(req.user.id, updateData, {
            new: true,
            runValidators: true
        }).populate('hasBought.item').populate('vip');

        if (!data) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
};

uploadAvatar = async (req, res, next) => {
    try {
        await upload(req, res);
        if (req.file == undefined) {
            return next(new AppError(400, 'fail', 'Please upload a file!'));
        }
        const user = await User.findByIdAndUpdate(req.user.id, {
            avatar: req.file.path
        }, {
            new: true,
            runValidators: true
        }).populate('hasBought.item').populate('vip');

        if (!user) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }

        res.status(200).json({
            status: 'success',
            data: user,
            file: req.file
        });
    } catch (err) {
        next(err);
    }
};

buyVip = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }
        const vip = await Vip.findById(req.body.id);
        if (!vip) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }
        if (user.vip) {
            return next(new AppError(400, 'fail', 'You already have a VIP'));
        }
        let user_money = user.money;
        let vip_price = vip.price;
        if (user_money < vip_price) {
            return next(new AppError(400, 'fail', 'Not enough money'));
        }
        user.money = user_money - vip_price;
        user.vip = vip._id;
        user.expireDay = addMonth(new Date(), vip.duration);
        user.save();
        const newUser = await User.findById(req.user.id).populate('hasBought.item').populate('vip');
        res.status(200).json({
            status: 'success',
            data: newUser
        });
        
    }
    catch (err) {
        next(err);
    }
};

buyItem = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }
        // Handle expired vip
        if (user.vip) {
            if (isVipExpired(user)) {
                user.vip = null;
                user.expireDay = null;
            }
        }
        // Buy items
        const vip = await Vip.findById(user.vip);
        let discount = vip ? vip.discount : 0;
        // Request body may be multiple items
        let items = req.body;
        if (!Array.isArray(items)) {
            items = [items];
        }
        let total_price = 0;
        let bought_items = [];
        for (let i = 0; i < items.length; i++) {
            let item = await Item.findById(items[i].id);
            if (!item) {
                continue;
            } else {
                const quantity = items[i].quantity;
                if (!validator.isInt(quantity.toString()) || item.amount < quantity || quantity < 1) {
                    continue;
                } else {
                    item.amount -= quantity;
                    total_price += item.price * quantity;
                    bought_items.push({
                        item: item._id,
                        quantity: quantity
                    });
                    item.save();
                }
            }
        }
        total_price = total_price * (1 - discount);
        if (user.money< total_price) {
            return next(new AppError(400, 'fail', 'Not enough money'));
        }
        user.money -= total_price;
        user.hasBought = user.hasBought.concat(bought_items);
        user.save();
        res.status(200).json({
            status: 'success',
            bought_items: bought_items
        });

    } catch (err) {
        next(err);
    }
};

addMoney = async (req, res, next) => {
    try {
        creditCard = req.body.creditCard;
        money = req.body.money;
        // Check credit card and money exists
        if (!creditCard || !money) {
            return next(new AppError(400, 'fail', 'Missing credit card or money'));
        }
        // Check credit card and money is valid
        if (!validator.isCreditCard(creditCard) || !validator.isInt(money.toString()) || money < 1) {
            return next(new AppError(400, 'fail', 'Invalid credit card or money'));
        }
        // Check user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }
        // Add money
        user.money += money;
        user.save();

        const newUser = await User.findById(userId).populate('hasBought.item').populate('vip');
        res.status(200).json({
            status: 'success',
            data: newUser
        });
    } catch (err) {
        next(err);
    }
};

sendMoney = async (req, res, next) => {
    try {
        const sender = await User.findById(req.user.id);
        const receiver = await User.findById(req.body.id);
        const money = req.body.money;
        // Check sender and receiver exists
        if (!sender || !receiver) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }
        // Check money exists and is valid
        if (!money || !validator.isInt(money.toString()) || money < 1) {
            return next(new AppError(400, 'fail', 'Invalid money'));
        }
        // Check sender has enough money
        if (sender.money < money) {
            return next(new AppError(400, 'fail', 'Not enough money'));
        }
        // Send money
        sender.money -= money;
        receiver.money += money;
        const transferData = await Transfer.create({
            sender: sender._id,
            receiver: receiver._id,
            money: money,
            note: req.body.note
        });
        sender.save();
        receiver.save();
        res.status(200).json({
            status: 'success',
            data: transferData
        });
    } catch (err) {
        next(err);
    }
};

getAllUsers = base.getAll(User,['hasBought.item','vip']);
getUser = base.getOne(User, ['hasBought.item','vip']);
createUser = base.create(User);
updateUser = base.updateOne(User);
deleteUser = base.deleteOne(User);
deleteAllUsers = base.deleteAll(User);

module.exports = {
    getCurrentUser,
    updateCurrentUser,
    uploadAvatar,
    buyItem,
    buyVip,
    addMoney,
    sendMoney,
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers
};