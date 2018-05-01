"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const passport=require('passport');
var passport_1 = __importDefault(require("passport"));
//const LocalStrategy=require('passport-local').Strategy;
var passport_local_1 = require("passport-local");
var connectionDB_1 = require("./connectionDB");
//will add user id to the session after passport.use verify user stored in db
passport_1.default.serializeUser(function (user, done) {
    console.log("serializing user");
    if (user && user.id) {
        return done(null, user.id);
    }
    done(new Error("User or User id not found"));
});
//deserialize will work for every request to authenticate logged user
passport_1.default.deserializeUser(function (userId, done) {
    console.log("deserializing user");
    connectionDB_1._User.findOne({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            done(null, user);
        }
        else {
            done(new Error("No such user found"));
        }
    }).catch(function (err) {
        done(err);
    });
});
//first of all this will work when login request comes to verify user
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'username',
    passwordField: 'password',
}, function (username, password, done) {
    console.log("using passport--" + username + "-" + password);
    connectionDB_1._User.findOne({
        where: {
            username: username
        }
    }).then(function (user) {
        if (!user) {
            console.log("no user");
            return done(null, false, { message: "User does not exist" });
        }
        if (user.password !== password) {
            return done(null, false, { message: "Password is wrong" });
        }
        done(null, user);
    }).catch(function (err) { return done(err); });
}));
exports.default = passport_1.default;
