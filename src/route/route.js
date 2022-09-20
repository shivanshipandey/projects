const mongoose= require('mongoose')
const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const middleware = require("../Middleware/auth")

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.post('/books',middleware.authentication, bookController.createBook )
module.exports = router;