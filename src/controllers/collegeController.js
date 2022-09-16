const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const validator = require("validator")

const createColleges = async function (req, res) {
    try {
        
        let data = req.body;
        let { name, fullName, logoLink } = data;

        let dataBody = Object.keys(data)
        if (dataBody.length == 0) {
            return res.status(400).send({ status: false, message: "please enter Data" });
        }
        if (dataBody.length > 4) {
            return res.status(400).send({ status: false, mssg: "Only name, fullName, logoLink, and idDeleted are allowed in the request body" })
        }
        if (!name) {
            return res.status(400).send({ status: false, message: "name is required" });
        }
        if (name.includes(" ")) {
            return res.status(400).send({ status: false, msg: "Space is not allowed" })
        }
        let nameAlreadyExist = await collegeModel.findOne({ name: name });
        if (nameAlreadyExist) {
            return res.status(400).send({ status: false, message: "name already exist" });
        }
        if (!fullName) {
            return res.status(400).send({ status: false, message: "fullName is required" });
        }
        if (!logoLink) {
            return res.status(400).send({ status: false, message: "logoLink is required" });
        }
        if(!validator.isURL(logoLink)){
            return res.status(400).send({ status : false, message : "LogoLink is inValid"})
        }

        let college = await collegeModel.create(data)
        let collegeData = {name: college.name, fullName: college.fullName, logoLink: college.logoLink, isDeleted: college.isDeleted}
        return res.status(201).send({ status: true, data: collegeData });

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message });
    }
};
//----------------------------------------------------------------------------------------------------------------------------------------//
const getInternsFromColleges = async function (req, res) {
    try {
        let collegeName = req.query.collegeName;
        if (!collegeName) {
            return res.status(400).send({ status: false, message: "Query is required, (only 'collegeName' is allowed)" })
        }
        if (Object.keys(req.query).length > 1) {
            return res.status(400).send({ status: false, message: "enter single query." })
        }

        const isLowerCase = (value) => {
            if (!(value === value.toLowerCase())) {
                return false
            }
            return true
        }
        if (!isLowerCase(collegeName)) {
            return res.status(400).send({ status: false, message: 'please use the lowercase in query' })
        }

        let isValid = await collegeModel.findOne({ name: collegeName });
        if (!isValid) {
            return res.status(404).send({
                status: false,
                message:
                    "No Colleges with this given query. please give a valid college Name",
            });
        }
        const { name, fullName, logoLink } = isValid
        const intern = await internModel.find({ collegeId: isValid._id }).select({ name: 1, email: 1, mobile: 1 })

        const data = {
            name: name,
            fullName: fullName,
            logoLink: logoLink,
            interns: intern.length ? intern : { message: "0 application from this college." }
        }
        return res.status(200).send({ status: true, data: data })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message });
    }
};
module.exports = { createColleges, getInternsFromColleges };
