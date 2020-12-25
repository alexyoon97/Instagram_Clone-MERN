const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User");

module.exports = (req,res,next) => {
    const{ authorization } = req.headers
    //authorization === Bearer '...token'
    if(!authorization) {
        return res.status(401).json({error:'you are not logged in first'})
    }
    const token = authorization.replace("Bearer " , "")
    jwt.verify(token, JWT_SECRET, (err,payload) =>{
        if(err){
            return res.status(401).json({error:'you are not logged in second'})
        }
        const {_id} = payload
        User.findById(_id)
        .then(userData=>{
            //set req.user as user that matches id to keep user data
            req.user = userData
            next()
        })
    })

}