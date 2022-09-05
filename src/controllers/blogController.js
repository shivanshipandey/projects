const { default: mongoose } = require("mongoose")
const blogModel = require("../models/blogModel")
const moment = require('moment')
const authorModel = require('../models/authorModel')

const createBlog = async function (req, res) {
     try {
          let blogData = req.body
          let authorID = blogData.authorId
          let checkID = await authorModel.findOne({_id : authorID})
          if(!checkID){ return res.status(200).send({status: false, message: "No such authorID found"})}
          if (!authorID) { return res.status(400).send({ status: false, message: "AuthorID required" }) }
          let isValid = mongoose.Types.ObjectId.isValid(authorID)
          if (!isValid) { return res.status(400).send({ status: false, message: "Not a Valid AuthorID" }) }
          let blogStored = await blogModel.create(blogData)
          res.status(201).send({ status: true, message: blogStored })
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}

module.exports.createBlog = createBlog;

