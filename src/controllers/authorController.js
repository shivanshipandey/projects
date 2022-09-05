const authorModel = require("../models/authorModel")

const createAuthor = async function (req, res){
     let authorData = req.body
     authorStored = await authorModel.create(authorData)
     res.status(201).send({msg : authorStored})
}

module.exports.createAuthor = createAuthor;

