"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// file creates tables and make connection with the database
//const Sequelize = require('sequelize')
var sequelize_1 = __importDefault(require("sequelize"));
var db = new sequelize_1.default('ngrwsdb', 'ngrusr', 'ngrpass', {
    dialect: 'mysql',
    host: 'localhost',
    // rest are optional
    port: 3306,
    // it means all the time at least one connection will be maintained if more request comes then at most 5 connection can be created
    pool: {
        max: 5,
        min: 1,
        idle: 1000 // create connection after this timeout
    },
    // metadata information regarding queries
    // create custom function if you want to store logs in other file
    logging: console.log
});
exports._User = db.define('user', {
    username: {
        type: sequelize_1.default.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
// Product table having id,name,price field and vendorId refernces  the vendor
exports._Product = db.define('products', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    price: {
        type: sequelize_1.default.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    }
});
// Vendor table fields are id a primary key acts as a foriegn key in product table and name
exports._Vendor = db.define('vendors', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
// Cart fields are id,quantity of the selected product,amount i.e price*quantity and productId references ProductId of Product Table
exports._Cart = db.define('carts', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: sequelize_1.default.INTEGER,
        allowNull: false
    },
    amount: {
        type: sequelize_1.default.FLOAT,
        defaultValue: 0.0
    }
});
// Vendor Product mapping creates a vendorId field in Product Table
exports._Vendor.hasMany(exports._Product);
exports._Product.belongsTo(exports._Vendor);
// Product Cart mapping creates productId field in the Cart Table
exports._Product.hasMany(exports._Cart);
exports._Cart.belongsTo(exports._Product);
exports._Cart.belongsTo(exports._User);
// make connection with the database and creates tables
db.sync().then(function () { return console.log('Database synced'); }).catch(function (err) { return console.log('Error creating database'); });
// // exporting created table instances
// exports = module.exports = {
// Product,Vendor,Cart,User
// }
