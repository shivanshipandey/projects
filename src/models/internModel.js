const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    mobile : {
        type : Number,
        required : true,
        unique : true
    },
    collegeId : {
        type : ObjectId,
        ref : "College",
        required : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
}, {timestamps : true})

module.exports = mongoose.model("interns", internSchema)