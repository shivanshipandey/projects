const mongoose = require('mongoose')
const AuthorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken');
const blogModel = require('../models/blogModel');


// Token Created

const loginAuthor = async function (req, res) {
    try {
        let { email, password } = req.body
        if (!email) return res.status(400).send({ status: false, message: "EmailId is mandatory" })
        if (!password) return res.status(400).send({ status: false, message: "Password is mandatory" })
        let authorCheck = await AuthorModel.findOne({ email: email, password: password });
        if (!authorCheck) return res.status(400).send({ status: false, message: "EmailId or password is incorrect" })
        let token = jwt.sign(
            {
                authorId: authorCheck._id.toString(),
                batch: "Plutonium",
                organisation: "Project-1, Group-34"
            },
            "Blogging-Site"
        );
        return res.status(201).send({ status: true, message: token })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//Authentication

const authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, message: "Token is missing" }) }
        let decodedToken = jwt.verify(token, "Blogging-Site")
        if (!decodedToken) { return res.status(400).send({ status: false, message: "Not a Valid Token" }) }
        next()
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//Authorization

const authorization = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        let ObjectID = mongoose.Types.ObjectId
        let decodedToken = jwt.verify(token, "Blogging-Site")
        if (req.query.authorId) {
            let authorId = req.query.authorId
            if (!ObjectID.isValid(authorId)) { return res.status(200).send({ status: false, message: "Not a valid AuthorID" }) }
            if (authorId != decodedToken.authorId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            return next()
        }
        if (req.params.blogId) {
            let blogId = req.params.blogId
            if (!ObjectID.isValid(blogId)) { return res.status(200).send({ status: false, message: "Not a valid BlogID" }) }
            let check = await blogModel.findById(blogId)
            if (!check) { return res.status(404).send({ status: false, message: "No such blog exists" }) }
            if (check.authorId != decodedToken.authorId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            return next()
        }
        if (req.body.authorId) {
            let authorId = req.body.authorId
            if (!ObjectID.isValid(authorId)) { return res.status(200).send({ status: false, message: "Not a valid AuthorID" }) }
            if (authorId != decodedToken.authorId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            return next()
        } else {
            return res.status(403).send({ status: false, message: "AuthorID or BlogID is mandatory" })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}




module.exports = { loginAuthor, authentication, authorization }