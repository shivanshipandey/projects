const blogModel = require("../models/blogModel")
const mongoose = require("mongoose")
const moment = require('moment')

const checkBlogs = async (req, res) => {

    try {
        let rBlogId = req.params.blogId
    let isValid = mongoose.Types.ObjectId.isValid(rBlogId)
    if(!isValid){ res.status(400).send({error:"Not a valid Blog ID"})}

    let dbBlogId = await blogModel.findById(rBlogId)

    if (dbBlogId) {
        if (dbBlogId.isDeleted == false) {
            let changeStatus = await blogModel.updateOne({_id:rBlogId},{$set:{isDeleted:true, deletedAt:moment().format() }},{new:true, upsert: true})
            return res.status(200).send({ status: true, msg: changeStatus })
        }else{
            return res.status(400).send({ status: false, msg: "" })
        }
    } 
    } catch (error) {
       return res.status(500).send({status: false, error: error.message}) 
    }

}

module.exports.checkBlogs = checkBlogs