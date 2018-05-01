//const User=require('../../connectionDB').User;//current file->parent->parent folder->db.js
import {_User} from '../../connectionDB'
//const route=require('express').Router();
import {Router,Request} from 'express';
//const passport=require('../../passport');
import passport from '../../passport';


const route:Router=Router();
interface RequestBody {
    [k: string]: string
  }
  


export class User{
    public id:number
    public username:string;
    public password:string;
    constructor(id:number,name:string,pass:string){
        this.id=id;
        this.username=name;
        this.password=pass;
    }
}

//get users request comes here
route.get('/',(req:Request,res)=>{
    console.log(req.user);
//  console.log(req.user.username)
    if (req.user) {
        res.status(200).send(req.user.username);
    } else {
        res.status(500).send({
            error: "No user"
        });
    }
  
})

//signup user request comes here
route.post('/signup',(req,res)=>{
    //add new user expect req to have name field in its body
    _User.create({
         username:req.body.username,
         password:req.body.password
    }).then((user)=>{
      res.status(201).send({
          success:true,
          message:'Registeration Successful',
          username:user.username,
          redirectUrl:'/login.html'
      })
    }).catch((err)=>{
        res.status(501).send({
            error:'Could Not add new User'
        })
    })
})

export default route

