const mongoose = require('mongoose')
const urlModel = require('../models/urlModel')
const validUrl = require('valid-url')
const shortId = require('shortid')

const urlShortener = async function (req, res) {
    try {
        let longUrl = req.body.longUrl

        if (Object.keys(req.body).length != 1) return res.status(400).send({ status: false, message: "please enter only long url" })
        if (!longUrl) {
            return res.status(400).send({ status: false, message: "LongUrl is mandatory" })
        }

        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({ status: false, message: "Url is not valid" })
        }
        let existurl = await urlModel.findOne({ longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })
        if (existurl) return res.status(200).send({ status: true, Data: existurl })
        let str = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let n = str.length
        console.log(n);
        let length = 6;

        let urlCode = '';

        for (let i = 0; i < length; i++) {

            urlCode = urlCode + str[(Math.floor(Math.random() * n))];
        }
        const shortUrl = "http://localhost:3000/" + urlCode;

        let urldata = {
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode
        }

        // console.log(shortUrl);
        // console.log(urlCode);

        let createurl = await urlModel.create(urldata)
        return res.status(201).send({ status: true, Data: createurl })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getUrl = async function(req,res){
    try {
    let urlCode = req.params.urlCode
    // console.log(typeof urlCode);
    if(!urlCode)return  res.status(400).send({status:false,message:"please give urlcode in params"})
    let urldata = await urlModel.findOne({urlCode})
    if(!urldata)return res.status(404).send({status:false,message:`no url found with this ${urlCode}`})
    return res.redirect(302,urldata.longUrl)
} catch (error) {
    return res.status(500).send({ status: false, message: error.message })
}
}
module.exports = { urlShortener,getUrl }