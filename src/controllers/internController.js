const mongoose = require('mongoose')
const InternModel = require('../models/internModel')

const createIntern = async function (req, res){
try{
    let Data = req.body
    let {name, email, mobile, collegeId} = req.body
    
    if(!name){
        res.status(400).send({status : false, message : "name is mandatory"})
    }
    if(!email){
        res.status(400).send({status : false, message : "Email is mandatory"})
    }
    if(!mobile){
        res.status(400).send({status: false, message : "Mobile Number is mandatory"})
    }
    if(!collegeId){
        res.status(400).send({status : false, message : "CollegeId is mandatory"})
    }

    let internData = await InternModel.create(Data)
    res.status(201).send({status: true, message : internData})
}catch(error){
    res.status(500).send({status: false, message : error.message})
}
}

module.exports = {
    createIntern
}
