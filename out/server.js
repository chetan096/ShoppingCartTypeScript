"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require('express') // expess module
var express_1 = __importDefault(require("express"));
//const path = require('path') // path module
var path_1 = __importDefault(require("path"));
var app = express_1.default(); // server instance
//const passport = require('./passport')
var passport_1 = __importDefault(require("./passport"));
//const session = require('express-session')
var express_session_1 = __importDefault(require("express-session"));
var index_1 = __importDefault(require("./routes/api/index"));
//make css folder static and accessible directly
app.use(express_1.default.static('out/public/css'));
app.use(express_1.default.static('out/public/view'));
app.use(express_1.default.static('out/public/images'));
//app.use(express.static('public'))
//make public folder inside current directory static
// app.use('/', (req, res, next) => {
//   express.static(path.join(__dirname, 'public'))
//   next()
// })
// create public a static website run index file by default
app.use(express_1.default.json()); // helps in sending json data
// helps in encoding url
app.use(express_1.default.urlencoded({
    extended: true
}));
//session attributes setting
app.use(express_session_1.default({
    secret: 'a secret key',
    resave: false,
    saveUninitialized: false
}));
//initializing passport and session
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
// if authentification fails redirect to the index.html otherwise redirect to show carts
app.post('/login', passport_1.default.authenticate('local', {
    failureRedirect: '/login.html',
    successRedirect: '/showProducts.html',
}));
// logout user and remove from session
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login.html');
});
app.use('/api', index_1.default); // it will mount index.js on this path
//manage html files 
// if direct page request comes then it will first authenticate if not logged in redirect to login.html else open required file
app.use('/', function (req, res, next) {
    if (!req.user) {
        if (req.path == '/signup.html' || req.path == '/login.html' || req.path == '/error.html') {
            res.sendFile(req.path, { root: path_1.default.join(__dirname, 'public') });
            return;
        }
        res.sendFile('/showProducts.html', { root: path_1.default.join(__dirname, 'public') });
    }
    else {
        if (req.path == '/' || req.path == "/login.html")
            res.sendFile('/showProducts.html', { root: path_1.default.join(__dirname, 'public') });
        else {
            if (req.path == "/signup.html" || req.path == "/showCart.html" || req.path == "/addProduct.html" || req.path == "/signup.html" || req.path == "/showProducts.html")
                res.sendFile(req.path, { root: path_1.default.join(__dirname, 'public') });
            else {
                res.sendFile('error.html', { root: path_1.default.join(__dirname, 'public') });
            }
        }
    }
});
// listen on 8000 port number of local host
app.listen(8000);
