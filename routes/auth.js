const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model('User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')

router.post('/signup', (req,res)=>{
    const {name, email, password} = req.body
    //send data in json
    if(!email || !password || !name){
        //make status into 422(error) not 200(success)
        return res.status(422).json({error:"please fill up all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser) =>{
        if(savedUser){
            return res.status(422).json({error:"User already exists with that email"})
        }
        bcrypt.hash(password, 12)
        .then(hashedpassword =>{
            const user = new User({
                name,
                email,
                password : hashedpassword
            })
    
            user.save()
            .then(user =>{
                res.json({message:'Signed up successfully',user})
            })
            //if catch an error while user.save()
            .catch(err=>{
                console.log(err);
            })
        })
    })
    //catch an error while findOne
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin', (req,res) => {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "please add email add password"})
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                // res.json({message:'successfully signed in'})
                //provide a token once user is signed in
                //generate a random token with users id and a SECRET
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id,name,email,followers,following,userProfilePic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,userProfilePic}})
            }
            else{
            return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router;