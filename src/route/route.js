const express = require('express')
const router = express.Router();
const {createColleges, getInternsFromColleges} = require('../controllers/collegeController')
const {createInterns} = require('../controllers/internController')


router.post('/functionup/colleges', createColleges, )

router.post('/functionup/interns', createInterns)

router.get('/functionup/collegeDetails', getInternsFromColleges )

router.all("/*", function (req, res) {
    res.status(400).send({status: false, message: "Make Sure Your Endpoint is Correct !!!"
    });
});

module.exports= router