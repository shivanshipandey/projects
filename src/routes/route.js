const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController.js")
const getBlog = require("../controllers/getDetails")
const deleteBlog = require('../controllers/deleteBlogController')
const deleteBlogs = require('../controllers/deleteBlogController')
const blogController = require("../controllers/blogController")
const updateController = require("../controllers/update")
const commonMW = require('../middleware/myMid')

// create author api
router.post("/authors", authorController.createAuthor)

// create blog api
router.post("/blogs", commonMW.auth, blogController.createBlog)

//get blogs 
router.get("/getBlogs", commonMW.auth, getBlog.getBlogs)

// DELETE /blogs/:blogId
router.delete('/blogs/:blogId', commonMW.auth, deleteBlog.checkBlogs)

//update blogs
router.put("/blogs/:blogId", commonMW.auth, updateController.updateBlog)

// DELETE /blogs?queryParams
router.delete("/blogs",commonMW.auth, deleteBlogs.deleteBlogs)

//Login Author
router.post('/login',commonMW.loginAuthor)


module.exports =router