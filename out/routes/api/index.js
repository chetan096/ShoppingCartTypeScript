"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const route=require('express').Router();
var express_1 = require("express");
var route = express_1.Router();
var users_1 = __importDefault(require("./users"));
var products_1 = __importDefault(require("./products"));
var vendors_1 = __importDefault(require("./vendors"));
var cart_1 = __importDefault(require("./cart"));
var routes = {
    userRoute: users_1.default, productRoute: products_1.default, vendorRoute: vendors_1.default, cartRoute: cart_1.default
};
//will mount user.js export on this url
route.use('/users', routes.userRoute);
//will mount products.js exports on this url
route.use('/products', routes.productRoute);
//will mount vendors.js exports on this url
route.use('/vendors', routes.vendorRoute);
//will mount cart.js export on this url
route.use('/cart', routes.cartRoute);
//export this route
exports.default = route;
