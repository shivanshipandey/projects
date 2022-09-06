const blogModel = require('../models/blogModel')

const updateBlog = async function (req, res) {
    try {
        let blogID = req.params.blogId
        let { title, body, tags, subcategory} = req.body
        let obj = {}
        let objarray = {}
        if(title != null){ obj.title = title}
        if(body != null){obj.body = body}
        if(tags != null){objarray.tags = tags}
        if(subcategory != null){objarray.subcategory = subcategory}
        let update = await blogModel.updateMany({_id : blogID},{$set: obj, $push: objarray}, {upsert: true, new: true})
        res.send({status: true, data: update})
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.updateBlog = updateBlog