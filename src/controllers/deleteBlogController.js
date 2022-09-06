const blogModel = require("../models/blogModel")
const mongoose = require("mongoose")
const moment = require('moment')

const checkBlogs = async (req, res) => {

    try {
        let rBlogId = req.params.blogId
        let isValid = mongoose.Types.ObjectId.isValid(rBlogId)
        if (!isValid) { return res.status(400).send({ error: "Not a valid Blog ID" }) }
        let dbBlogId = await blogModel.findById(rBlogId)
        if (dbBlogId) {
            if (dbBlogId.isDeleted == false) {
                let changeStatus = await blogModel.updateOne({ _id: rBlogId }, { $set: { isDeleted: true, deletedAt: moment().format() } }, { new: true, upsert: true })
                let deletedAt = dbBlogId.deletedAt
                return res.status(200).send({ status: true, msg:"data Deleted successfully", changeStatus, deletedAt})
            } else {
                return res.status(400).send({ status: false, msg: "Data is already deleted." })
            }
        }
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }

}

//second quesiton of delete api 

const deleteBlogs = async function (req, res) {
    try {
        let obj = req.query
        let { authorId, category, tags, subcategory, isPublished } = obj
        let isValid = mongoose.Types.ObjectId.isValid(authorId)
        if (Object.keys(obj).length === 0) {
            return res.status(400).send({ status: false, message: "Please give some parameters to check" })
        }
        if (authorId) {
            if (!isValid) {
                return res.status(400).send({ status: false, message: "Not a valid Author ID" })
            }
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
            
            let deletedData = await blogModel.updateMany(filter, { isDeleted: true  ,deletedAt: moment().format() }, { upsert: true, new: true })
        let deletedAt = moment().format()   
         return res.status(200).send({ status: true, msg: "data deleted successfully",message: deletedData,deletedAt :deletedAt })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.deleteBlogs = deleteBlogs
module.exports.checkBlogs = checkBlogs