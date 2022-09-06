const { default: mongoose } = require("mongoose")
const blogModel = require("../models/blogModel")
const moment = require('moment')
const authorModel = require('../models/authorModel')

const createBlog = async function (req, res) {
     try {
          let {authorId, isPublished } = req.body
          if (!authorId) { return res.status(400).send({ status: false, message: "AuthorID required" })}
          let isValid = mongoose.Types.ObjectId.isValid(authorId)
          if (!isValid) { return res.status(400).send({ status: false, message: "Not a Valid AuthorID" }) }
          let checkID = await authorModel.findOne({_id : authorId})
          if(!checkID){ return res.status(200).send({status: false, message: "No such authorID found"})}
          if(isPublished == true){
               req.body.publishedAt = moment().format()
          }
          let blogStored = await blogModel.create(req.body)
          
          res.status(201).send({ status: true, message: blogStored, })
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}

module.exports.createBlog = createBlog;

