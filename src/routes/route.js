const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController.js")
const getBlog = require("../controllers/getDetails")



// create author api
router.post("/authors", authorController.createAuthor)

router.get("/getBlogs", getBlog.getBlogs)







module.exports =router