const Vip = require('../models/vipModel');
const base = require('./baseController');

getAllVips = base.getAll(Vip);
getVip = base.getOne(Vip);

// admin
createVip = base.create(Vip);
updateVip = base.updateOne(Vip);
deleteVip = base.deleteOne(Vip);
deleteAllVips = base.deleteAll(Vip);

module.exports = {
    getAllVips,
    getVip,
    createVip,
    updateVip,
    deleteVip,
    deleteAllVips
};