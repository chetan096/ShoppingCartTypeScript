const User=require('../../connectionDB').User;//current file->parent->parent folder->db.js
const route=require('express').Router();
const passport=require('../../passport');

//get users request comes here
route.get('/',(req,res)=>{
   console.log(req.user.username)
   res.status(200).send(req.user.username)
})

//signup user request comes here
route.post('/signup',(req,res)=>{
    //add new user expect req to have name field in its body
    User.create({
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

exports=module.exports=route

