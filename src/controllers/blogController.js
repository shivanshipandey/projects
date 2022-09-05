const blogModel = require("../models/blogModel")

const createBlog = async function (req, res){
     let blogData = req.body
     blogStored = await blogModel.create(blogData)
     res.status(201).send({msg : blogStored})
}

module.exports.createBlog = createBlog;

