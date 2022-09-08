const mongoose = require('mongoose')
const AuthorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken');
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
                return res.status(400).send({ status: false, message: "you have entered incorrect token or. incorrect length of token" })
            } (decode == true)
            next()
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//Authorization

const authorization = async function (req, res, next) {
    try {
        token = req.headers['x-api-key']
        let ObjectID = mongoose.Types.ObjectId
        decodedToken = jwt.verify(token, "Blogging-Site")
        if (req.query.authorId) {
            let authorId = req.query.authorId
            if (!ObjectID.isValid(authorId)) { return res.status(400).send({ status: false, message: "Not a valid AuthorID" }) }
            if (authorId != decodedToken.authorId) {
                return res.status(403).send({ status: false, message: "You are not a authorized user" })
            }
            return next()
        }
        console.log(req.params.blogId)
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
        else {
            return res.status(403).send({ status: false, message: "AuthorID or BlogID is mandatory" })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// next function for delete api **********************************************************

let fucntionForDeleteFilter = async function (req, res, next) {
    try {
        let obj = req.query
        let { authorId, category, tags, subcategory, isPublished } = obj
        let token = req.headers['x-api-key']
        // let ObjectID = mongoose.Types.ObjectId
        let decodedToken = jwt.verify(token, "Blogging-Site")
        let AuthorID = decodedToken.authorId
        if (req.query.authorId) {
            if (AuthorID != req.query.authorId) return res.status(403).send({ status: false, nesssage: " You are not authorised " })
        }

        let filter = { isDeleted: false, authorId: AuthorID }
        if (authorId != null) { filter.authorId = authorId }
        if (category != null) { filter.category = category }
        if (tags != null) { filter.tags = { $in: [tags] } }
        if (subcategory != null) { filter.subcategory = { $in: [subcategory] } }
        if (isPublished != null) { filter.isPublished = isPublished }

        let filtered = await blogModel.find(filter)

        if (filtered.length == 0) {
            return res.status(400).send({ status: false, message: "No such data found" })
        } else {
            console.log("next chal raha he ")
            next()

        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}




module.exports = { authentication, authorization, fucntionForDeleteFilter }