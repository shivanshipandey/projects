const express = require('express')
const router = express.Router()
const urlController = require('../controller/urlController')


router.post('/url/shorten', urlController.urlShortener)
router.get('/:urlCode',urlController.getUrl)

router.all("/*", function (req, res) {
    res.status(400).send({status: false, message: "Make Sure Your Endpoint is Correct !!!"
    })
})

module.exports= router

