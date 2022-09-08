const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel');

let token
let decodedToken
//Authentication

const authentication = async function (req, res, next) {
    try {
        token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, message: "Token is missing" }) }
        decodedToken = jwt.verify(token, "Blogging-Site", (err, decode) => {
            if (err) {
                return res.status(400).send({ status: false, message: "Token is not correct!" })
            } (decode == true)
            next()
        })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//Authorization

const authorization = async function (req, res, next) {
    try {
        let ObjectID = mongoose.Types.ObjectId
        if (req.query.authorId) {
            let authorId = req.query.authorId
            if (!ObjectID.isValid(authorId)) { return res.status(400).send({ status: false, message: "Not a valid AuthorID" }) }
            if (authorId != decodedToken.authorId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            return next()
        }

        if (req.params.blogId) {
            let decodedToken = jwt.verify(token, "Blogging-Site")
            let blogId = req.params.blogId
            if (!ObjectID.isValid(blogId)) { return res.status(400).send({ status: false, message: "Not a valid BlogID" }) }
            let check = await blogModel.findById(blogId)
            if (!check) { return res.status(404).send({ status: false, message: "No such blog exists" }) }
            if (check.authorId != decodedToken.authorId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            return next()
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//when user do not authorID for deletion in query params
const delWithoutID = async function (req, res, next) {
    try {
        let { authorId, category, tags, subcategory, isPublished } = req.query
        let AuthorID = decodedToken.authorId
        token = req.headers['x-api-key']
        decodedToken = jwt.verify(token, "Blogging-Site")
        if (req.query.authorId) {
            if (AuthorID != authorId) {
                return res.status(403).send({ status: false, messsage: " You are not authorized " })
            }
        }
        let filter = { isDeleted: false, authorId: AuthorID }
        if (authorId != null) { filter.authorId = authorId }
        if (category != null) { filter.category = category }
        if (tags != null) { filter.tags = { $in: [tags] } }
        if (subcategory != null) { filter.subcategory = { $in: [subcategory] } }
        if (isPublished != null) { filter.isPublished = isPublished }
        let filtered = await blogModel.find(filter)
        if (!filtered.length) {
            return res.status(400).send({ status: false, message: "No such data found" })
        }
        next()
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// next function for delete api **********************************************************

module.exports = { authentication, authorization, delWithoutID }
