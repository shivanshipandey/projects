const mongoose = require('mongoose')
const urlModel = require('../models/urlModel')
const validUrl = require('valid-url')
const shortId = require('shortid')

const urlShortener = async function (req, res){
    try{
        let longUrl = req.body.longUrl

        if(!longUrl){
            return res.status(400).send({ status: false, message : "LongUrl is mandatory"})
        }

        if(!validUrl.isUri(longUrl)){
            return res.status(400).send({ status : false, message : "Url is not valid"})
        }

        

    }catch(error){
        return res.status(500).send({ status : false, message : error.messaeg})
    }
}

module.exports = {urlShortener}