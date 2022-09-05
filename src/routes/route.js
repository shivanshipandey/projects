const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController.js")
const getBlog = require("../controllers/getDetails")

const blogController =   require("../controllers/blogController")


// create author api
router.post("/authors", authorController.createAuthor)

// create blog api
router.post("/blogs",blogController.createBlog)

//get blogs 
router.get("/getBlogs", getBlog.getBlogs)







module.exports =router