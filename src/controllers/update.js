const { updateMany } = require('../models/blogModel')
const blogModel = require('../models/blogModel')
const moment = require('moment')
const { default: mongoose } = require('mongoose')

const updateBlog = async function (req, res) {
    try {
        let blogID = req.params.blogId
        let { title, body, tags, subcategory } = req.body
        let isValid = mongoose.Types.ObjectId.isValid(blogID)
        if (!isValid) { return res.status(400).send({ status: false, message: "Not a valid BlogID" }) }
        let deleteCheck = await blogModel.findOne({_id: blogID, isDeleted: false})
        if (!deleteCheck) { return res.status(404).send({ status: false, message: "No such blog exist" }) }
        let obj = {}
        let objarray = {}
        if (title != null) { obj.title = title }
        if (body != null) { obj.body = body }
        if (tags != null) { objarray.tags = tags }
        if (subcategory != null) { objarray.subcategory = subcategory }
        let update = await blogModel.updateMany({ _id: blogID }, { $set: obj, $push: objarray }, { upsert: true, new: true })
        let updatePublish = await blogModel.updateMany({ _id: blogID }, { isPublished: true, publishedAt: moment().format() }, { upsert: true, new: true })
         let publishedAt = moment().format()
        res.send({ status: true, publishedAt : publishedAt,data: {update, updatePublish}})
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.updateBlog = updateBlog