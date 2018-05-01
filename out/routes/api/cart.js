"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//get Cart table instance from connectionDB
//const Cart = require('../../connectionDB').Cart;//current file->parent->parent folder->db.js
var connectionDB_1 = require("../../connectionDB");
//middleware route for this file requests
//const route = require('express').Router();
var express_1 = require("express");
var route = express_1.Router();
//Product Table instance
var connectionDB_2 = require("../../connectionDB");
var Cart = /** @class */ (function () {
    function Cart(id, quantity, amount) {
        this.id = id;
        this.quantity = quantity;
        this.amount = amount;
    }
    return Cart;
}());
exports.Cart = Cart;
//get request for cart comes here
route.get('/', function (req, res) {
    // const body:RequestBody=req.body;
    if (!req.user) {
        return res.redirect('/login.html');
    }
    //get cart function returns array of sequelize objects in cart send as json response
    getCart(req).then(function (cart) { return res.status(200).json(cart); }).catch(function (err) {
        res.status(500).send({
            error: "Could not get Cart"
        });
    });
});
//adding product to cart request comes here
route.post('/', function (req, res) {
    if (!req.user) {
        return res.status(403).send({
            error: 'Please login before adding products to cart'
        });
    }
    //find cart entry for corresponding product id in cart table if no item then add new entry otherwise update quantity of that cart entry
    connectionDB_1._Cart.findOne({
        where: {
            productId: req.body.productId,
            userId: req.user.id
        },
        include: [{
                model: connectionDB_2._Product
            }]
    }).then(function (item) {
        //if item found update quantity
        // var set:_Cart.set;
        if (item != null) {
            item.set('quantity', item.quantity + 1);
            item.set('amount', item.amount + item.product.price);
            item.save().then(function (item) {
                res.status(200).send(item);
            }).catch(function (err) {
                console.log(err);
                res.status(500).send({
                    error: "Could not add product to cart"
                });
            });
        }
        else {
            //if not found then create new entry in cart table set quantity to 1
            getPrice(req.body.productId).then(function (price) {
                var user = req.body.user;
                connectionDB_1._Cart.create({
                    productId: req.body.productId,
                    amount: price,
                    quantity: 1,
                    userId: user.id
                }).then(function (cart) {
                    res.status(201).send(cart);
                }).catch(function (err) {
                    console.log(err);
                    res.status(501).send({
                        error: 'Could Not add new Product'
                    });
                });
            });
        }
    }).catch(function (err) {
        res.status(500).send({
            error: "Error while adding product to cart"
        });
    });
});
//update quantity of cart entry comes here
route.put('/', function (req, res) {
    if (!req.user) {
        return res.status(403).send({
            error: 'Please login before updating cart'
        });
    }
    //find item in cart with the same product id as comes in request
    connectionDB_1._Cart.find({
        where: {
            productId: req.body.productId,
            userId: req.user.id
        },
        include: [{
                model: connectionDB_2._Product
            }]
    }).then(function (item) {
        console.log(item);
        //if flag true then increment otherwise decrement
        var flag;
        //check if type of increase in body of request is string 
        if (typeof req.body.increase == 'string') {
            flag = (req.body.increase == 'true');
        }
        else {
            flag = req.body.increase;
        }
        //flag true
        if (flag) {
            item.set('quantity', item.quantity + 1);
            item.set('amount', item.amount + item.product.price);
            item.save().then(function () {
                getCart(req).then(function (cart) {
                    res.status(200).json(cart);
                }).catch(function (err) {
                    console.log(err);
                    res.status(500).send({
                        error: "Could not update item in cart"
                    });
                });
            }).catch(function (err) {
                console.log(err);
                res.status(500).send({
                    error: "Could not update item in cart"
                });
            });
        }
        else {
            //if quantity 1 and request for decrease the delete item from cart and new cart array as json response
            if (item.quantity == 1) {
                connectionDB_1._Cart.destroy({
                    where: {
                        id: item.id
                    }
                }).then(function () {
                    getCart(req).then(function (cart) {
                        res.status(200).json(cart);
                    }).catch(function (err) {
                        console.log(err);
                        res.status(500).send({
                            error: "Could not update item in cart"
                        });
                    });
                }).catch(function (err) {
                    console.log(err);
                    res.status(500).send({
                        error: "could not delete item from cart"
                    });
                });
            }
            else {
                //if quantity more than 1
                item.set('quantity', item.quantity - 1);
                item.set('amount', item.amount - item.product.price);
                item.save().then(function () {
                    getCart(req).then(function (cart) {
                        res.status(200).json(cart);
                    }).catch(function (err) {
                        console.log(err);
                        res.status(500).send({
                            error: "Could not update item in cart"
                        });
                    });
                }).catch(function (err) {
                    console.log(err);
                    res.status(500).send({
                        error: "Could not update item in cart"
                    });
                });
            }
        }
    }).catch(function (err) {
        console.log(err);
        res.status(500).send({
            error: "Could not update item in cart"
        });
    });
});
//get price of product
function getPrice(i) {
    return __awaiter(this, void 0, void 0, function () {
        var product;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectionDB_2._Product.findOne({
                        where: {
                            id: i
                        }
                    }).catch(function (err) { return console.log(err); })];
                case 1:
                    product = _a.sent();
                    return [2 /*return*/, product.price];
            }
        });
    });
}
//get cart from cart table
function getCart(req) {
    return __awaiter(this, void 0, void 0, function () {
        var cart;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(req.user.id);
                    return [4 /*yield*/, connectionDB_1._Cart.findAll({
                            where: {
                                userId: req.user.id
                            },
                            include: [{
                                    model: connectionDB_2._Product
                                }]
                        })];
                case 1:
                    cart = _a.sent();
                    return [2 /*return*/, cart];
            }
        });
    });
}
//export route
exports.default = route;
