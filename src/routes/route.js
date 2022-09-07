const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController.js")
const blogController = require("../controllers/blogController")
const commonMW = require('../middleware/myMid')

// create author api
router.post("/authors", authorController.createAuthor)

// create blog api
router.post("/blogs", commonMW.authentication, blogController.createBlog)

//get blogs 
router.get("/getBlogs", commonMW.authentication, blogController.getBlogs)

//update blogs
router.put("/blogs/:blogId", commonMW.authentication, commonMW.authorization, blogController.updateBlog)

// DELETE /blogs/:blogId
router.delete('/blogs/:blogId', commonMW.authentication, commonMW.authorization, blogController.deleteByBlogID)

// DELETE /blogs?queryParams
router.delete("/blogs",commonMW.authentication, commonMW.authorization, blogController.deleteByFilter)

//Login Author
router.post('/login',commonMW.loginAuthor)


module.exports =router