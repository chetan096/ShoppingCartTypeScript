//const passport=require('passport');
import passport from 'passport'
//const LocalStrategy=require('passport-local').Strategy;
import {Strategy as LocalStrategy} from 'passport-local';
//const User=require('./connectionDB').User;
import {User} from './routes/api/users'
import {_User} from './connectionDB';


 
//will add user id to the session after passport.use verify user stored in db
passport.serializeUser((user:User,done:any)=>{
    console.log("serializing user");
    if(user && user.id){
       return done(null,user.id);
    }
    done(new Error("User or User id not found"))
})
//deserialize will work for every request to authenticate logged user
passport.deserializeUser((userId:number,done:any)=>{
    console.log("deserializing user")
    _User.findOne({
        where:{
            id:userId
        }
    }).then((user)=>{
        if(user){
            done(null,user)
        }else{
            done(new Error("No such user found"))
        }
    }).catch((err)=>{
        done(err);
    })
})

//first of all this will work when login request comes to verify user
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
},(username:string,password:string,done:any)=>{
    console.log("using passport--"+username+"-"+password)
    _User.findOne({
        where:{
            username:username
        }
    }).then((user)=>{
        if(!user){
            console.log("no user")
            return done(null,false,{message:"User does not exist"})
        }
        if(user.password!==password){
           return done(null,false,{message:"Password is wrong"})
        }
        done(null,user)
    }).catch((err)=>done(err))
}))

export default passport

