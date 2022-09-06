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

//update blogs
router.put("/blogs/:blogId", updateController.updateBlog)

//delete api 
router.delete("/blogs/:blogId", deleteBlog.checkBlogs)

// delete blogs

router.delete("/blogss",deleteBlog.deleteBlogs)




module.exports =router