const Transfer = require('../models/transferModel');
const base = require('./baseController');

getAllTransfers = base.getAll(Transfer, ['sender', 'receiver']);
getTransfer = base.getOne(Transfer, ['sender', 'receiver']);
deleteTransfer = base.deleteOne(Transfer);
deleteAllTransfers = base.deleteAll(Transfer);

getUserTransfer = async (req, res) => {
    try {
        const query = Transfer.find({ $or: [{ sender: req.user.id }, { receiver: req.user.id }] }).populate('sender').populate('receiver');
        let data = await query;

        if (!data) {
            res.status(200).json({
                status: 'success',
                message: 'No transfer found'
            });
        } else {
            res.status(200).json({
                status: 'success',
                data
            });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllTransfers,
    getTransfer,
    getUserTransfer,
    deleteTransfer,
    deleteAllTransfers
};