const jwt = require("jsonwebtoken")
const bookModel= require("../models/bookModel")
const mongoose = require('mongoose')



//==========================================================  AUTHENTICATION  =========================================================================================//



const authentication =async function(req,res,next){
    try{

        let token =req.headers[`x-api-key`]

        if(!token){
            return res.status(401).send({status:false, message:"token must present"})
        }

        let decodeToken = jwt.decode(token)
        if(!decodeToken) {
            return res.status(400).send({ status: false, message: "Invalid authentication token in request headers." })}
            if(Date.now()>(decodeToken.exp)*1000){
                return res.status(440).send({status:false, message:"Session expired!please login again"})
            }

        jwt.verify(token, "project-3//bookmanagemnt-35", function(err,decode){
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



//========================================================  AUTHORISATION  ==============================================================================================//



const authorisation = async function(req,res,next){
    try{

    let getBookByParam = req.params.bookId

    if(!getBookByParam){
        return res.status(400).send({status:false, message: "Please provide BookId"}
        )
    }

    let isValid = mongoose.Types.ObjectId.isValid
    if(!isValid(getBookByParam)){
        return res.status(400).send({ status : false, mssg : "BookId is invalid"})
    }

    let getBookDetail = await bookModel.findById(getBookByParam)
    if(!getBookDetail){
        return res.status(404).send({status:false, message: "No book found with this Id"})
    }

    if(getBookDetail.userId!=req.token.userId){
        return res.status(403).send({status:false, message: "Access Denied You are not Authorised User"})
        }

    }catch(err){
    return res.status(500).send({status:false, message:err.message})
    }
    
    next();
    }



//========================================================  AUTHPORISATION 2  =================================================================================//



const authorisation2 =async function(req,res,next){
    try{   

        data= req.body
       
        if(data.userId !=req.token.userId){
            return res.status(403).send({status: false, mssg :"Authorisation Failed"})
        }

        }catch(err){
        return res.status(500).send({status:false, message:err.message})

    }
    next();
}



module.exports ={authentication, authorisation, authorisation2}