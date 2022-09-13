const express = require('express')
const router = express.Router();
const {createColleges, getColleges} = require('../controllers/collegeController')
const {createInterns} = require('../controllers/internController')

router.get('/test-me', function (req, res) {
    res.send('My first Api!')
})


router.post('/functionup/colleges', createColleges, getColleges)

router.post('/functionup/interns', createInterns)

router.get('/functionup/collegeDetails', )

module.exports= router