"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// middleware route for this file
//const route = require('express').Router()
var route = express_1.Router();
// get Vendor table reference from connectionDB 
//const Vendor = require('../../connectionDB').Vendor
var connectionDB_1 = require("../../connectionDB");
var Vendor = /** @class */ (function () {
    function Vendor(id, name) {
        this.id = id;
        this.name = name;
    }
    return Vendor;
}());
exports.Vendor = Vendor;
// get vendors request comes here
route.get('/', function (req, res) {
    connectionDB_1._Vendor.findAll().then(function (vendors) { return res.status(200).json(vendors); }).catch(function (err) {
        res.status(500).send({
            error: 'Could not get Vendors'
        });
    });
});
exports.default = route;
