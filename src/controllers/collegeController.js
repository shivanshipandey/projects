const mongoose = require('mongoose')
const collegeModel = require('../models/collegeModel')

const createColleges = async function (req, res) {
    try {

        let data = req.body
        let { name, fullName, logoLink } = data
        
        let dataBody = Object.keys(data)
        if (dataBody.length == 0) {
            return res.status(400).send({ status: false, msg: 'please enter Data' })
        }
        if (!name) {
            return res.status(400).send({ status: false, msg: 'name is required' })
        }
        let nameAlreadyExist = await collegeModel.findOne({ name: name })
        if (nameAlreadyExist) {
            return res.status(400).send({ status: false, msg: 'name already exist' })
        }
        if (!fullName) {
            return res.status(400).send({ status: false, msg: 'fullName is required' })
        }
        if (!logoLink) {
            return res.status(400).send({ status: false, msg: 'logoLink is required' })
        }

        //Body should not exceed the length by 4

        if(dataBody.length>4){
            res.status(400).send({status: false, mssg : "Only name, fullName, logoLink, and idDeleted are allowed in the request body"})
        }

        //Space will not be tolerated

        if(name.includes(" ")){
            res.status(400).send({status : false, msg : "Space is not allowed"})
        }
        
        let collegeData = await collegeModel.create(data)
        return res.status(201).send({ status: true, msg: 'college data created successfully', data: collegeData })

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}


const getColleges = async function (req, res) {

    try {
        let getData = await collegeModel.find()
        return res.status(200).send({ status: true, data: getData })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}


module.exports = { createColleges, getColleges }