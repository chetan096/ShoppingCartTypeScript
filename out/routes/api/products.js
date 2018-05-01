"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// get Product Table instance from connectionDB.js
//const Product = require('../../connectionDB').Product; // current file->parent->parent folder->db.js
var connectionDB_1 = require("../../connectionDB");
// Vendor instance
//const Vendor = require('../../connectionDB').Vendor
var connectionDB_2 = require("../../connectionDB");
// middleware route for this file
//const route = require('express').Router()
var express_1 = require("express");
var route = express_1.Router();
var Product = /** @class */ (function () {
    function Product(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    return Product;
}());
exports.Product = Product;
// get product request comes here
route.get('/', function (req, res) {
    connectionDB_1._Product.findAll({
        include: [{
                model: connectionDB_2._Vendor
            }]
    }).then(function (products) {
        res.status(200).json(products);
    }).catch(function (error) {
        res.status(500).send({
            error: 'Could not retrieve Products'
        });
    });
});
// post request for product comes here
route.post('/', function (req, res) {
    var body = req.body;
    // if price not a number
    var price = parseFloat(body.price);
    if (isNaN(price)) {
        return res.status(403).send({
            error: 'Please enter valid price'
        });
    }
    if (!req.user) {
        return res.status(403).send({
            error: 'Please login before adding Products'
        });
    }
    // create product instance in product table
    connectionDB_1._Product.create({
        name: req.body.name,
        price: parseFloat(req.body.price),
        vendorId: req.body.vendorId
    }).then(function (product) {
        res.status(201).send(product);
    }).catch(function (err) {
        res.status(501).send({
            error: 'Could Not add new Product'
        });
    });
});
exports.default = route;
