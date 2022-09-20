const userModel = require("../models/userModel")
const mongoose = require("mongoose")
const validator = require('validator')
const jwt = require('jsonwebtoken')

const createUser = async function (req, res){
    try{
        let data = req.body
        let {title, name, phone, email, password, address} = data

        const nameRegex = /^[a-z\s]+$/i
        const phoneRegex = /^[6-9][0-9]+$/ 


        let dataBody = Object.keys(data)
        if(dataBody.length == 0){
            return res.status(400).send({ status : false, mssg : "DataBody can not be empty"})
        }

        if(dataBody.length > 6){
            return res.status(400).send({ status : false, mssg : "Length of the body can not be more than 6"})
        }

        if(!title){
            return res.status(400).send({ status : false, mssg : "title is mandatory"})
        }
         
        if(!(title == "Mr", "Mrs", "Miss" )){
            return res.status(400).send({ status : false, mssg : "Tittle can not be other then Mr, Mrs, Miss"})
        }

        if (!name){
            return res.status(400).send({ status : false, mssg : "Name is mandatory"})
        }

        if(!name.match(nameRegex)){
            return res.status(400).send({ status : false, mssg : "Plz do not enter any special character in name"})
        }

        if(!phone){
            return res.status(400).send({ status : false, mssg : "Phone number is mandatory"})
        }

        if(!phone.match(phoneRegex)){
            return res.status(400).send({ status : false, mssg : "Phone NUmber is invalid"})
        }

        if(phone.length < 10 || phone.length > 10){
            return res.status(400).send({ status : false, mssg : "Phone number is not valid"})
        }

        let phoneExist = await userModel.findOne({phone})
            if(phoneExist){
                return res.status(400).send({ status : false, mssg :"Phone number already exists"})
            }
        

        if(!email){
            return res.status(400).send({ status : false, mssg : "Email is madatory"})
        }

        if(!validator.isEmail(email)){
            return res.status(400).send({ status : false, mssg : "Email is not valid"})
        }

        let emailExist = await userModel.findOne({email})
        if(emailExist){
            return res.status(400).send({ status : false, mssg : "Email Id already exists"})
        }

        if(!password){
            return res.status(400).send({ status : false, mssg : "Password is mandatory"})
        }

        if(password.length < 8 || password.length >15){
            return res.status(400).send({ status : false, mssg : "Password's length is not correct"})
        }

        if(password.includes(" ")){
            return res.status(400).send({ status : false, mssg : "Space is not allowed in password"})
        }
        
        let addWithPin = address.pincode
       
        if(addWithPin.length < 6 || addWithPin.length > 6){
            return res.status(400).send({ status : false, mssg : "length of pincode is not correct"})
        }

        let userData = await userModel.create(data)
        return res.status(201).send({ status : true , data : userData})

    }catch(err){
        return res.status(500).send({ status : false, mssg: err.message})
    }
}



//====================================================LOGIN USER===================================================================

const isValid= function(value){
    if( typeof value=="undefined"|| value==null )return false;
    if(typeof value =="string" && value.trim().length==0 ) return false;
    return true;
}
const isValidRequest =function(reqBody){
    return Object.keys(reqBody).length>0
}
const loginUser = async function(req,res){
    try{
        let data =req.body;
        const {email , password} = data
        if(!isValidRequest(data)){
            return res.status(400).send({status:false, msg:"Please provide credentials"})
        }
        if(!isValid(email)){
            return res.status(400).send({status:false, msg:"please provide email"})
        }

        const isVaildEmail= validator.isEmail(email)
        if(isVaildEmail==false){
            return res.status(400).send({status:false, msg:"please enter vaild email"})
        }

        const user = await userModel.findOne({email:email})
        if(!user){
            return res.status(404).send({status: false, msg:"user not found"})
        }

        if(!isValid(password)){
            return res.status(400).send({status:false, msg:"please provide password"})
        }

        if(password.length < 8 || password.length >15){
            return res.status(400).send({ status : false, mssg : "Password's length is not correct"})
        }

        if(user.password != password){
            return res.status(403).send({status:false, msg:"please provide vaild password"})
        }
        
        const token = jwt.sign(
            {
                
                    userId: user["_id"].toString(),
                    iat: Math.floor(Date.now() / 1000),///to get time in second
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)///expire in 1hour
                  
            },
            "project-3//bookmanagemnt-35"
        );
        return res.status(200).send({status: true , msg:"Success", data:{ token}})
    }catch(err){
        return res.status(500).send({status: false, msg: err.message})
    }
}




 

      module.exports = {createUser , loginUser}