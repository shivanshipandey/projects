const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController.js")
const getBlog = require("../controllers/getDetails")
const deleteBlog = require('../controllers/deleteBlogController')

const blogController =   require("../controllers/blogController")
const updateController = require("../controllers/update")


// create author api
router.post("/authors", authorController.createAuthor)

// create blog api
router.post("/blogs",blogController.createBlog)

//get blogs 
router.get("/getBlogs", getBlog.getBlogs)

<<<<<<< HEAD
// DELETE /blogs/:blogId
router.delete('/blogs/:blogId', deleteBlog.checkBlogs)
=======
//update blogs
router.put("/blogs/:blogId", updateController.updateBlog)
>>>>>>> 95c11c25915dcff2bf81ba75e1926d37b4679750







module.exports =router