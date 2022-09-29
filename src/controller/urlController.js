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
        let existUrl = await urlModel.findOne({longUrl}).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
        if(existUrl){return res.status(200).send({status:true,data:existUrl})
    }
        let baseUrl = "http://localhost:3000"
        const urlCode = shortId.generate()
    
        const shortUrl = baseUrl + '/' + urlCode

        let all = {
            longUrl:longUrl,
            shortUrl:shortUrl,
            urlCode:urlCode
        };
        let urlData = await urlModel.create(all)
        return res.status(201).send({status:true,data:urlData})
        

    }catch(error){
        return res.status(500).send({ status : false, message : error.message})
    }
}

module.exports = {urlShortener}