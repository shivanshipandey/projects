const mongoose = require('mongoose')
const collegeModel = require('../models/collegeModel')

const createColleges = async function (req, res) {
    try {
        const logoRegex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/

        let data = req.body
        let { name, fullName, logoLink } = data

        if (Object.keys(data).length == 0) {
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
        if (!logoLink.match(logoRegex)) {
            return res.status(400).send({ status: false, msg: 'invalid format of logoLink' })
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