const mongoose = require("mongoose")
const blogModel = require("../models/blogModel")
const moment = require('moment')
const authorModel = require('../models/authorModel')


let isValid = mongoose.Types.ObjectId.isValid
let time = moment().format()

//CREATE BLOG

const createBlog = async function (req, res) {
     try {

          // Inserting credentials is mandatory

          let { title, body, authorId, category, isPublished, subcategory, tags } = req.body
          if (!title) {
               return res.status(400).send({ status: false, message: "title is required" })
          }
          if (!body) {
               return res.status(400).send({ status: false, message: "body is required" })
          }
          if (!authorId) {
               return res.status(400).send({ status: false, message: "AuthorID is required" })
          }
          if (!isValid(authorId)) {
               return res.status(400).send({ status: false, message: "Not a Valid AuthorID" })
          }
          if (!category) {
               return res.status(400).send({ status: false, message: "category is required" })
          }
          let checkID = await authorModel.findOne({ _id: authorId })
          if (!checkID) {
               return res.status(404).send({ status: false, message: "No such authorID found" })
          }

          // Title should be in Strings only

          if (typeof (title) != "string") {
               return res.status(400).send({ status: false, message: "Give title only in a String." })
          }

          // Body should be in strings only
          if (typeof (body) != "string") {
               return res.status(400).send({ status: false, message: "Give body only in a String." })
          }

          //if tags is present then it should be an array
          if (tags) {
               if (!Array.isArray(tags)) {
                    return res.status(400).send({ status: false, message: "Give tags only in a array of String." })
               }
          }

          // categories should be in Strings only
          if (typeof (category) != "string") {
               return res.status(400).send({ status: false, message: "Give category only in a String." })
          }

          //if subcategory is present then it should be an array
          if (subcategory) {
               if (!Array.isArray(subcategory)) {
                    return res.status(400).send({ status: false, message: "Give subcategory only in a array of String." })
               }
          }

          //if isPublished is present then it should be Boolean
          if (isPublished) {
               if (typeof (isPublished) != "boolean") {
                    return res.status(400).send({ status: false, message: "isPublished can be true or false only" })
               }
          }


          //Here's the creation of blog
          if (isPublished == true) { req.body.publishedAt = time }
          let blogStored = await blogModel.create(req.body)
          res.status(201).send({ status: true, message: blogStored, })
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}

//GET BLOGS

const getBlogs = async function (req, res) {
     try {
          let obj = req.query
          let { authorId, category, tags, subcategory } = obj
          if (Object.keys(obj).length != 0) {
               if (authorId) {

                    // checking whether authorId is valid or not

                    if (!isValid(authorId)) {
                         return res.status(400).send({ status: false, message: "Not a valid Author ID" })
                    }
               }
               let filter = { isPublished: true, isDeleted: false }
               if (authorId != null) { filter.authorId = authorId }
               if (category != null) { filter.category = category }
               if (tags != null) { filter.tags = { $in: [tags] } }
               if (subcategory != null) { filter.subcategory = { $in: [subcategory] } }
               let filtered = await blogModel.find(filter)
               if (filtered.length == 0) {
                    return res.status(404).send({ status: false, message: "No such data found" })
               }
               res.status(200).send({ status: true, message: filtered })
          }
          else {
               let getBlogs = await blogModel.find({ $and: [{ isPublished: true }, { isDeleted: false }] })
               if (!getBlogs.length) {
                    return res.status(404).send({ status: false, data: "No such blog found" })
               }
               return res.status(200).send({ status: true, data: getBlogs })
          }
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}


//UPDATE BLOG

const updateBlog = async function (req, res) {
     try {
          let blogID = req.params.blogId
          let { title, body, tags, subcategory } = req.body
          let deleteCheck = await blogModel.findOne({ _id: blogID, isDeleted: false })
          if (!deleteCheck) {
               return res.status(404).send({ status: false, message: "No such blog exist" })
          }
          let obj = {
               isPublished: true,
               publishedAt: time
          }
          let objarray = {}
          if (title != null) { obj.title = title }
          if (body != null) { obj.body = body }
          if (tags != null) { objarray.tags = tags }
          if (subcategory != null) { objarray.subcategory = subcategory }
          let update = await blogModel.findOneAndUpdate({ _id: blogID }, { $set: obj, $push: objarray }, { upsert: true, new: true })
          res.status(200).send({ status: true, data: update })
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}


//DELETE BLOGS BY PATH PARAMS

const deleteByBlogID = async (req, res) => {

     try {
          let BlogId = req.params.blogId
          let check = await blogModel.findById(BlogId)
          if (check) {
               if (check.isDeleted == false) {
                    let changeStatus = await blogModel.findOneAndUpdate({ _id: BlogId }, { $set: { isDeleted: true, deletedAt: time } }, { new: true, upsert: true })
                    return res.status(200).send({ status: true, msg: "Data Deleted successfully", changeStatus })
               } else {
                    return res.status(404).send({ status: false, msg: "Data had been deleted." })
               }
          }
     } catch (error) {
          return res.status(500).send({ status: false, error: error.message })
     }

}


//DELETE BLOGS BY QUERY PARAMS  

const deleteByFilter = async function (req, res) {
     try {

          // parameters are mandatory to be filled in query section
          let obj = req.query
          let { authorId, category, tags, subcategory, isPublished } = obj

          if (Object.keys(obj).length === 0) {
               return res.status(400).send({ status: false, message: "Please give some parameters to check" })
          }
          let check = ["true","false"]
          if (isPublished) {
               if (!check.includes(isPublished)) { return res.status(400).send({ status: false, message: "Please give true or false value to isPublished" }) }
          }
          let filter = {}
          if (authorId) { filter.authorId = authorId }
          if (category) { filter.category = category }
          if (tags) { filter.tags = tags }
          if (subcategory) { filter.subcategory = subcategory }
          if (check.includes(isPublished)) { filter.isPublished = Boolean(isPublished) }
          if(!Object.keys(filter).length) return res.status(400).send({status:false,message:"Please provide a valid filter"})
          if(!authorId) filter.authorId = req.decode.authorId
          filter.isDeleted = false;

          let filtered = await blogModel.find(filter)
          if (filtered.length == 0) {
               return res.status(400).send({ status: false, message: "No such data found" })
          } else {
               let deletedData = await blogModel.updateMany(filter, { isDeleted: true, deletedAt: time }, { upsert: true, new: true })
               return res.status(200).send({ status: true, message: deletedData })
          }
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}



module.exports = { createBlog, getBlogs, updateBlog, deleteByFilter, deleteByBlogID }
