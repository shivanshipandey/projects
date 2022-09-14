const mongoose = require('mongoose')
const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel')

const createInterns = async function (req, res) {
    try {

        const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
        const nameRegex = /^[a-z\s]+$/i
        const mobileRegex = /^\d{10}$/

        let data = req.body
        let { name, email, mobile, collegeName } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "please enter data" })
        }
        if (!name) {
            return res.status(400).send({ status: false, message: "name is mandatory" })
        }
        if (!name.match(nameRegex)) {
            return res.status(400).send({ status: false, message: "name is invalid" })
        }
        if (!email) {
            return res.status(400).send({ status: false, message: "Email is mandatory" })
        }
        if (!email.match(emailRegex)) {
            return res.status(400).send({ status: false, message: "email is invalid" })
        }
        let emailAlreadyExist = await internModel.findOne({ email: email })
        if (emailAlreadyExist) {
            return res.status(400).send({ status: false, message: "email is already exist" })
        }
        if (!mobile) {
            res.status(400).send({ status: false, message: "Mobile Number is mandatory" })
        }
        if (!mobile.match(mobileRegex)) {
            return res.status(400).send({ status: false, message: "Mobile Number is invalid" })
        }
        let mobileAlreadyExist = await internModel.findOne({ mobile: mobile })
        if (mobileAlreadyExist) {
            return res.status(400).send({ status: false, message: "Mobile Number is already exist" })
        }
        // if (!collegeId) {
        //     return res.status(400).send({ status: false, message: "CollegeId is mandatory" })
        // }
        // if (!mongoose.Types.ObjectId.isValid(collegeId)) {
        //     return res.status(400).send({ status: false, message: "CollegeId is invalid" })
        // }

        data.collegeName = " "

        let clgName = await collegeModel.findOne({ name: collegeName })
        if (!clgName) {
            return res.status(400).send({ status: false, message: "collegeName does not exist" })
        
    }
        
        let internData = await internModel.create(data)
        return res.status(201).send({ status: true, msg: 'intern data created successfully', data: internData })

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}

module.exports = { createInterns }
