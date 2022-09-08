const mongoose = require("mongoose")
const blogModel = require("../models/blogModel")
const moment = require('moment')
const authorModel = require('../models/authorModel')


//Create Blog

const createBlog = async function (req, res) {
     try {
          let { authorId, isPublished } = req.body
          if (!authorId) { return res.status(400).send({ status: false, message: "AuthorID required" }) }
          let isValid = mongoose.Types.ObjectId.isValid(authorId)
          if (!isValid) { return res.status(400).send({ status: false, message: "Not a Valid AuthorID" }) }
          let checkID = await authorModel.findOne({ _id: authorId })
          if (!checkID) { return res.status(404).send({ status: false, message: "No such authorID found" }) }
          if (isPublished == true) {
               req.body.publishedAt = moment().format()
          }
          let blogStored = await blogModel.create(req.body)
          res.status(201).send({ status: true, message: blogStored, })
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}

//get Blogs
const getBlogs = async function (req, res) {
     try {
          let obj = req.query
          let { authorId, category, tags, subcategory } = obj
          let isValid = mongoose.Types.ObjectId.isValid(authorId)
          if (Object.keys(obj).length != 0) {
               if (authorId) {
                    if (!isValid) { return res.status(400).send({ status: false, message: "Not a valid Author ID" }) }
               }
               let filter = { isPublished: true, isDeleted: false }
               if (authorId != null) { filter.authorId = authorId }
               if (category != null) { filter.category = category }
               if (tags != null) { filter.tags = { $in: [tags] }}
               if (subcategory != null) { filter.subcategory = { $in: [subcategory] } }
               let filtered = await blogModel.find(filter)
               if (filtered.length == 0) { return res.status(404).send({ status: false, message: "No such data found" }) }
               res.status(200).send({ status: true, message: filtered })
          }
          else {
               let getBlogs = await blogModel.find({ $and: [{ isPublished: true }, { isDeleted: false }] })
               if (!getBlogs.length) { return res.status(404).send({ status: false, data: "No such blog found" }) }
               return res.status(200).send({ status: true, data: getBlogs })
          }
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}


//update Blogs

const updateBlog = async function (req, res) {
     try {
          let blogID = req.params.blogId
          let { title, body, tags, subcategory } = req.body
          let deleteCheck = await blogModel.findOne({ _id: blogID, isDeleted: false })
          if (!deleteCheck) { return res.status(404).send({ status: false, message: "No such blog exist" }) }
          let obj = {
               isPublished: true, 
               publishedAt: moment().format()
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


//Delete Blogs by Params

const deleteByBlogID = async (req, res) => {

     try {
          let rBlogId = req.params.blogId
          let dbBlogId = await blogModel.findById(rBlogId)
          if (dbBlogId) {
               if (dbBlogId.isDeleted == false) {
                    let changeStatus = await blogModel.findOneAndUpdate({ _id: rBlogId }, { $set: { isDeleted: true, deletedAt: moment().format() } }, { new: true, upsert: true })
                    let deletedAt = dbBlogId.deletedAt
                    return res.status(200).send({ status: true, msg: "Data Deleted successfully", changeStatus, deletedAt })
               } else {
                    return res.status(404).send({ status: false, msg: "Data had been deleted." })
               }
          }
     } catch (error) {
          return res.status(500).send({ status: false, error: error.message })
     }

}


//Delete Blogs by Query  

const deleteByFilter = async function (req, res) {
     try {
          let obj = req.query
          let { authorId, category, tags, subcategory, isPublished } = obj
        //  if (!authorId) { return res.status(400).send({ status: false, message: "AuthorID required" }) }
          if (Object.keys(obj).length === 0) {
               return res.status(400).send({ status: false, message: "Please give some parameters to check" })
          }
          let filter = { isDeleted: false }
          if (authorId != null) { filter.authorId = authorId }
          if (category != null) { filter.category = category }
          if (tags != null) { filter.tags = { $in: [tags] } }
          if (subcategory != null) { filter.subcategory = { $in: [subcategory] } }
          if (isPublished != null) { filter.isPublished = isPublished }
          let filtered = await blogModel.find(filter)
          if (filtered.length == 0) {
               return res.status(400).send({ status: false, message: "No such data found" })
          } else {
               let deletedData = await blogModel.findOneAndUpdate(filter, { isDeleted: true, deletedAt: moment().format() }, { upsert: true, new: true })
               return res.status(200).send({ status: true, message: deletedData })
          }
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}



module.exports = { createBlog, getBlogs, updateBlog, deleteByFilter, deleteByBlogID }
