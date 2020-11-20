const express=require('express');
const router=express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
const requireLogin=require('../middleware/requireLogin');
const crypto=require('crypto');
const JWT_SECRET='secret';
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const {SENDGRID_API,EMAIL}=require('../config/keys');


const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

router.get('/',(req,res)=>{
    res.send('Hello');
});
router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body;
 if(!email || !password || !name || !pic){
    return res.status(422).json({error:"please add all the fields"})
 }
 User.findOne({email:email})
 .then((saveUser)=>{
     if(saveUser){
         return res.status(422).json({error:"User already exists with that email"});
     }
     bcrypt.hash(password,12)
     .then(hashedpassword=>{
        const user = new User({
            email,password:hashedpassword,name,pic:pic
        })
        user.save()
        .then(user=>{
            transporter.sendMail({
                to:user.email,
                from:'nitiknarang77@gmail.com',
                subject:'Signup Success',
                html:'<h1>Welcome to my instagram</h1>'
            })
         return res.json({message:'saved successfully'});
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })

     })
  
 })
 .catch(err=>{
     console.log(err);
 })
 
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
      return  res.status(422).json({error:'please add email or password'});
    }
    User.findOne({email:email})
    .then(saveUser=>{
        if(!saveUser){
           return  res.status(422).json({error:'Invalid email or password'});
        }
        bcrypt.compare(password,saveUser.password)
        .then(doMatch=>{
            if(doMatch){
               // res.json({message:'successfully sign in'})
               const token=jwt.sign({_id:saveUser._id},JWT_SECRET);
               const {_id,name,email,followers,following,pic}=saveUser;
               res.json({token,user:{_id,name,email,followers,following,pic}});
            }
            else{
                return res.json({error:"Invalid Email or Password"})
            }
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})
router.post('/reset-password',(req,res)=>{
//generating a crypto token for re-setting the password
crypto.randomBytes(32,(err,buffer)=>{
    if(err){
        console.log(err);
    }
    const token=buffer.toString("hex");
    User.findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"User with that email does not exist"})
        }
        user.resetToken=token
        user.expiresToken=Date.now() + 3600000
        user.save()
        .then(result=>{

            transporter.sendMail({
                to:user.email,
                from:"nitiknarang77@gmail.com",
                subject:"password reset",
                html:`
                <p>You are requested for password</p>
                <h5>Click on this <a href="${EMAIL}/reset/${token}">link<a/> to reset password></h5>
                `
            })
            res.json({message:'Check you email'});

        })
    })
})
})
router.post('/new-password',(req,res)=>{
    const newPassword=req.body.password;
    const newToken=req.body.token;
    User.findOne({resetToken:newToken,expiresToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try Again seesion expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password=hashedpassword;
            user.resetToken=undefined;
            user.expiresToken=undefined;
            user.save().then(savedUser=>{
                res.json({message:"Password updated success"})
            })
        })
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

module.exports=router;