const { get } = require('mongoose')
const blogModel = require('../models/blogModel')

const getBlogs = async function(req, res){
    try{
        let authorId = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags

        let getBlogs = await blogModel.find({ isPublished: true}, {isDeleted: false})
        if(!getBlogs) { return res.status(404).send({status: false, data: "No such blog found"})}
     //   let filtered = await getBlogs.find({authorId: authorId}, {category: category}, {tags:tags})
        res.status(200).send({status : true , data : getBlogs})

    }
    catch(error){
        res.status(500).send({ status: false, message: error.message})
    }
}

module.exports.getBlogs = getBlogs