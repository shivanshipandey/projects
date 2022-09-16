const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel')

const createInterns = async function (req, res) {
    try {

        const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
        const nameRegex = /^[a-z\s]+$/i
        const mobileRegex = /^[6-9][0-9]+$/

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
        if( mobile.length < 10 || mobile.length > 10){
            return res.status(400).send({ status: false, message: "Mobile Number should be ten digit" })
        }
        let mobileAlreadyExist = await internModel.findOne({ mobile: mobile })
        if (mobileAlreadyExist) {
            return res.status(400).send({ status: false, message: "Mobile Number is already exist" })
        }
        if (!collegeName) {
            return res.status(400).send({ status: false, message: 'college name is mandatory' })
        }
        let clgName = await collegeModel.findOne({ name: collegeName })
        if (!clgName) {
            return res.status(400).send({ status: false, message: "collegeName does not exist" })
        }
        else {
            data['collegeId'] = clgName._id
        }

        let intern = await internModel.create(data)
        let internData = {isDeleted: intern.isDeleted, name: intern.name, email: intern.email, mobile: intern.mobile, collegeId: intern.collegeId }

        return res.status(201).send({ status: true, data: internData })

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}

module.exports = {  createInterns }
