const userModel = require('../model/userModel');
const bcrypt = require("bcrypt");
const aws =require("aws-sdk")

const createUser = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin",'*')
    try {
        let userBody = JSON.parse(req.body.data)
        let files = req.files
        const profileImage = await aws.uploadFile(files[0])
        let { fname, lname, email, phone, password, address } = userBody;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const userData = { fname, lname, email, profileImage, phone, password, address }
        const dataCreated = await userModel.create(userData);
        return res.status(201).send({ status: true, message: 'User created successfully', data: dataCreated });
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}










    module.exports = { createUser}