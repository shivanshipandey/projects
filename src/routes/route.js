const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController.js")
<<<<<<< HEAD
const getBlog = require("../controllers/getDetails")

=======
const blogController =   require("../controllers/blogController")
>>>>>>> 411d20da77339ced17a069214cbd71f2f997a924


// create author api
router.post("/authors", authorController.createAuthor)
<<<<<<< HEAD

router.get("/getBlogs", getBlog.getBlogs)

=======
// create blog api
router.post("/blogs",blogController.createBlog)
>>>>>>> 411d20da77339ced17a069214cbd71f2f997a924






module.exports =router