const mongoose = require('mongoose')
const AuthorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken');
const BlogModel = require('../models/blogModel')


// Token Created


const loginAuthor = async function(req, res){
    try{
         let Email = req.body.email;
         let password = req.body.password;
         if(!Email) return res.status(400).send({status: false, mssg: "EmailId is mandatory"})
         if(!password) return res.status(400).send({ status: false, mssg : "Password is mandatory"})
         let authorCheck = await AuthorModel.findOne({ email : Email, password : password});
         if (!authorCheck) return res.status(400).send({status : false, mssg : "EmailId or password is incorrect"})

         let token = jwt.sign(
              {
                   authorId : authorCheck._id.toString(),
                   batch : "Plutonium",
                   organisation : "Project-1, Group-34"
              },
              "Blogging-Site"
         );
         return res.status(201).send({ status : true, mssg : token})
    }
    catch(err){
         res.status(500).send({status : false, mssg : err.message})
    }
}
//Authentication

const auth = async function(req, res, next){
    try{
        let authorId = req.body.authorId
        console.log(authorId)
        //let blogID = req.params.blogId
        let token = req.headers['x-api-key']
        if(!token) return res.status(400).send({ status: false, mssg : "Token is missing"});
        let decodedToken = jwt.verify(token, "Blogging-Site")
        let user = await AuthorModel.findById(decodedToken.authorId)
        
        
      
        console.log(decodedToken.authorId)
        if(authorId == user._id){
           // return res.send({status: false, message: "User is not authorized."})
        next()
        }
        let blogUser = await BlogModel.findById(blogID)
        let blogAuthor = blogUser.authorId 
        let user2 = await AuthorModel.findById(blogAuthor)
         if(user2._id == decodedToken.authorId){
            
        
            next()
            //return res.status(400).send({ status : false, mssg : "you are not Authorised"})
        //}
        // else if(!user)  return res.status(400).send({status: false, mssg : "User not found"}) 
        //  else if(!decodedToken){ 
           // return res.status(400).send({status : false, mssg : "Not Authorised"})
           
    }else{
        //next()
       // return res.status(400).send({status : false, mssg : "Not Authorised"})
           
    }
    }catch(error){
        res.status(500).send({status: false, mssg: error.message })
    }
}




module.exports={auth, loginAuthor}