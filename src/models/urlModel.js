const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    urlCode : {
        required : true,
        type : String, 
        unique : true,
        trim : true
    },
    longUrl : {
        // required : true,
        type : String
    },
    shortUrl : {
<<<<<<< HEAD
        // required : true, 
        // unique : true,
        type : String
=======
        required : true, 
        unique : true,
        type : String,
>>>>>>> cda193304250fe1c9b63b8027d55027aeb9ac736
    }
}, {timestamps : true})

module.exports = mongoose.model('Url', urlSchema)

