const userModel = require("../models/userModel")
const moongoose = require("mongoosse")


const isValid = function (value) {
    if (typeof value === "undefined" || value === null ) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "number") return false;

    return true

  };

  const isvalidRequest = function (requestBody) {
    return Object.keys(requestBody).length > 0
  }


  let creatuser = async function(req,res){
    try { 
        let user = req.request
        let userCreated = await userModel.create(user)

  return res.status(201).send({status:true, data: userCreated })
        
        }catch(error){
            return res.status(500).send({status:false, message:error.message})
        }
      }
 

      module.exports = {creatuser }