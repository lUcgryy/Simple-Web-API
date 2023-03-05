
db = db.getSiblingDB('simple');

db.users.drop();
db.items.drop();
db.vips.drop();
db.transfers.drop();

db.createCollection('users');
db.createCollection('items');
db.createCollection('vips');
db.createCollection('transfers');


db.users.insertOne({
    name: 'Giang',
    email: 'admin@gmail.com',
    avatar: '/assets/default.jpg',
    role: 'admin',
    phone: '0123456789',
    username: 'admin',
    password: '$2a$12$gQrgqGqBKAAWR37x/lE20.JR0WFHxlubLwja3tr7SdxnkBkqruvuO', // 123456
    money: 0,
    hasBought: [],
    resetToken: 'ba3cbac3e19fd621abcdf53c0068723ca4a283d9eef55aa5f57982f68e5f90a7'
});

db.items.insertMany([
    {
        "name": "Táo",
        "description": "Táo Mỹ",
        "amount": 5,
        "price": 200
    },
    {
        "name": "Chuối",
        "description": "Non",
        "amount": 6,
        "price": 200
    },
    {
        "name": "Dâu",
        "description": "Đà Lạt",
        "amount": 7,
        "price": 300
    },
    {
        "name": "Thanh Long",
        "description": "Bình Thuận",
        "amount": 8,
        "price": 400
    },
    {
        "name": "Cam",
        "description": "Nó màu Cam",
        "amount": 9,
        "price": 500
    }
]);

db.vips.insertMany([
    {
        "type": "Month",
        "price": 200,
        "duration": 1
    },
    {
        "type": "Year",
        "price": 1500,
        "duration": 12
    }
]);