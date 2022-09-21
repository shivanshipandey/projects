const mongoose= require('mongoose')
const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const middleware = require("../Middleware/auth")

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.post('/books', bookController.createBook )
router.post("/books/:bookId/review", reviewController.createReview)
router.get("/books", bookController.getBookByQuery)
router.get('/books/:bookId', bookController.getBookByParam)
router.put("/books/:bookId", bookController.updateBooks)
router.delete('/books/:bookId', bookController.deletedByParams)
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)

router.all("/*", function (req, res) {
    res.status(400).send({status: false, mssg: "Make Sure Your Endpoint is Correct !!!"
    })
})

module.exports = router;