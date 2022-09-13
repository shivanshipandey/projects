const mongoose = require('mongoose')
const CollegeModel = require('../models/collegeModel')

const createCollege = async function (req, res){
    try{
    let data = req.body
    let collegeData = await CollegeModel.create(data)
    res.status(201).send({status: true, mssg : collegeData})
    }catch(error){
        res.status(500).send({status : false, mssg : error.message})
    }
}


module.exports = {createCollege}