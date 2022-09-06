const mongoose = require('mongoose')
const blogModel = require('../models/blogModel')
const getBlogs = async function (req, res) {
    try {
        let obj = req.query
        let { authorId, category, tags, subcategory} = obj
        let isValid = mongoose.Types.ObjectId.isValid(authorId)
        if (Object.keys(obj).length != 0) {
            if (authorId) {
                if (!isValid) { return res.status(400).send({ status: false, message: "Not a valid Author ID" }) }
            }
            let filter = {isPublished: true ,  isDeleted: false}
            if(authorId != null){ filter.authorId = authorId}
            if(category != null){ filter.category = category}
            if(tags != null){ filter.tags = {$in:[tags]}}
            if(subcategory != null){ filter.subcategory = {$in:[subcategory]}}
            let filtered = await blogModel.find(filter)
            if(filtered.length == 0){ return res.status(400).send({ status: false, message: "No such data found"})}
            return res.status(200).send({ status: true, message: filtered })
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

module.exports.getBlogs = getBlogs