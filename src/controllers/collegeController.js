const mongoose = require("mongoose");
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

const createColleges = async function (req, res) {
    try {

        let data = req.body;
        let { name, fullName, logoLink } = data;

        let dataBody = Object.keys(data)
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "please enter Data" });
        }
        if (!name) {
            return res.status(400).send({ status: false, message: "name is required" });
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
       
        if(dataBody.length > 4){
            res.status(400).send({status: false, mssg : "Only name, fullName, logoLink, and idDeleted are allowed in the request body"})
        }

        if(name.includes(" ")){
            res.status(400).send({status : false, msg : "Space is not allowed"})
        }

        let collegeData = await collegeModel.create(data);
        return res.status(201).send({
            status: true, message: "college data created successfully", data: collegeData,
        });

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message });
    }
};

const getInternsFromColleges = async function (req, res) {
    try {
        let collegeName = req.query.collegeName;
        if (!collegeName) {
            return res.status(400).send({ status: false, message: "Query is required." })
        }
        if (Object.keys(req.query).length > 1) {
            return res.status(400).send({ status: false, message: "enter single query." })
        }
        let isValid = await collegeModel.findOne({ name: collegeName });
        if (!isValid) {
            return res.status(404).send({
                status: false,
                message:
                    "No Colleges with this given query. please give a valid college Name",
            });
        }
        const clg = await collegeModel.findOne({ name: collegeName })
        const { name, fullName, logoLink } = clg
        const intern = await internModel.find({ collegeId: collegeName._id }).select({ name: 1, email: 1, mobile: 1 })

        const data = {
            name: name,
            fullName: fullName,
            logoLink: logoLink,
            interns: [intern.length ? intern : { message: "0 application from this college." }]
        }
        return res.status(200).send({ status: true, data: data })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message });
    }
};

module.exports = { createColleges, getInternsFromColleges };
