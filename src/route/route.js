const express = require('express')
const router = express.Router();
const {createColleges, getInternsFromColleges} = require('../controllers/collegeController')
const {createInterns} = require('../controllers/internController')


router.get('/test-me', function (req, res) {
    res.send('My first Api!')
})


router.post('/functionup/colleges', createColleges, )

router.post('/functionup/interns', createInterns)

router.get('/functionup/collegeDetails', getInternsFromColleges )

router.all("/*", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct !!!"
    })
})

module.exports= router