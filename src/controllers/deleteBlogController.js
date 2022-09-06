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

//second quesiton of delte api 

const deleteBlogs = async function (req, res) {
    try {
        let obj = req.query
        let { authorId, category, tags, subcategory } = obj
        let isValid = mongoose.Types.ObjectId.isValid(authorId)
        if (Object.keys(obj).length != 0) {
            if (authorId) {
                if (!isValid) { return res.status(400).send({ status: false, message: "Not a valid Author ID" }) }
            }


            let deleteCheking = await blogModel.findOne({authorId})
            let checkDelte = deleteCheking.isDeleted
            console.log(deleteCheking)
            console.log(deleteCheking.isDeleted)
            if(checkDelte == true   ){
               return res.status(404).send({status:false , msg : "this blog is deleted, you can't delete it "})
            }
            

            

            let filter = {}
            if (authorId != null) { filter.authorId = authorId }
            if (category != null) { filter.category = category }
            if (tags != null) { filter.tags = { $in: [tags] } }
            if (subcategory != null) { filter.subcategory = { $in: [subcategory] } }
            let filtered = await blogModel.find(filter)
            if (filtered.length == 0) { 
                return res.status(400).send({ status: false, message: "No such data found" })
             }else {
           
            let deletedData = await blogModel.updateOne({authorId: filter.authorId},{isDeleted : true}, { upsert: true, new: true }) 
            return res.status(200).send({ status: true, message: deletedData} )
        }
        }
        // else {
        //     let getBlogs = await blogModel.find({ $and: [{ isPublished: true }, { isDeleted: false }] })
        //     if (!getBlogs.length) { return res.status(404).send({ status: false, data: "No such blog found" }) }
        //     return res.status(200).send({ status: true, data: getBlogs })
        // }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.deleteBlogs = deleteBlogs
module.exports.checkBlogs = checkBlogs