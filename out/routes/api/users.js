"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const User=require('../../connectionDB').User;//current file->parent->parent folder->db.js
var connectionDB_1 = require("../../connectionDB");
//const route=require('express').Router();
var express_1 = require("express");
var route = express_1.Router();
var User = /** @class */ (function () {
    function User(id, name, pass) {
        this.id = id;
        this.username = name;
        this.password = pass;
    }
    return User;
}());
exports.User = User;
//get users request comes here
route.get('/', function (req, res) {
    console.log(req.user);
    //  console.log(req.user.username)
    if (req.user) {
        res.status(200).send(req.user.username);
    }
    else {
        res.status(500).send({
            error: "No user"
        });
    }
});
//signup user request comes here
route.post('/signup', function (req, res) {
    //add new user expect req to have name field in its body
    connectionDB_1._User.create({
        username: req.body.username,
        password: req.body.password
    }).then(function (user) {
        res.status(201).send({
            success: true,
            message: 'Registeration Successful',
            username: user.username,
            redirectUrl: '/login.html'
        });
    }).catch(function (err) {
        res.status(501).send({
            error: 'Could Not add new User'
        });
    });
});
exports.default = route;
