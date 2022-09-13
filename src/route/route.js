const express = require('express')
const router = express.Router();
const CollegeController = require('../controllers/collegeController')
const InternController = require('../controllers/internController')

router.get('/test-me', function (req, res) {
    res.send('My first Api!')
})

router.post('/functionup/colleges', CollegeController.createCollege)

router.post('/functionup/interns', InternController.createIntern)

module.exports= router