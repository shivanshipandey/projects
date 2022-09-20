const jwt = require("jsonwebtoken")
const userModel =require("../models/userModel")
const bookModel= require("../models/bookModel")

////authentication////
const authentication =async function(req,res,next){
    try{
        let token =req.headers[`x-api-key`]
        if(!token){
            return res.status(401).send({status:false, message:"token must present"})
        }
        let decodeToken = jwt.verify(token, "project-3//bookmanagemnt-35", function(err,decode){
            if(err){
                return res.status(403).send({status:false, message:"Invalid User"})
            }
            return decode;
        })
        req.token= decodeToken;
        next();
    }catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}


module.exports ={authentication}