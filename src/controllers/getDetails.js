const mongoose = require('mongoose')
const blogModel = require('../models/blogModel')
const getBlogs = async function (req, res) {
    try {
        let obj = req.query
        let authorId = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        let isValid = mongoose.Types.ObjectId.isValid(authorId)

        if (Object.keys(obj).length != 0) {
            if (authorId) {
                if (!isValid) { return res.status(400).send({ status: false, message: "Not a valid Author ID" }) }
            }
            let filtered = await blogModel.find(
                {
                    $and:
                        [
                            { $or: [{undefined : authorId}, {authorId : authorId}] },
                            { $or: [{undefined : category}, {category : category}] },
                            { $or: [{undefined : tags}, {tags : {$in: [tags]}}] },
                            { $or: [{undefined : subcategory}, {subcategory : subcategory}] },
                            { $and: [{undefined : authorId}, {authorId : authorId}] },
                            { $and: [{undefined : category}, {category : category}] },
                            { $and: [{undefined : tags}, {tags : {$in: [tags]}}] },
                            { $and: [{undefined : subcategory}, {subcategory : subcategory}] }
                        ]
                })
                console.log(authorId)
                console.log(category)
                //if(filtered.length == 0){ return res.status(400).send({ status: false, message: "No such data found"})}
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