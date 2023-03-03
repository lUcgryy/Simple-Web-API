const Item = require("../models/itemModel");
const base = require("./baseController");

getAllItems = base.getAll(Item);
getItem = base.getOne(Item);

// admin
createItem = base.create(Item);
updateItem = base.updateOne(Item);
deleteItem = base.deleteOne(Item);
deleteAllItems = base.deleteAll(Item);

module.exports = {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    deleteAllItems
};