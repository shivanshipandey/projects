const productModel = require('../models/productModel')
const aws = require('../aws/awsUpload')
const validation = require('../validator/validation')

let { isValid, isEmpty, isValidPrice, isValidStyle, isValidObjectId } = validation;

const createProduct = async (req, res) => {
    try {
        let data = req.body
        let files = req.files

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: "false", message: "Please enter the data in request body" });
        }

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data;

        if (!isEmpty(title)) {
            return res.status(400).send({ status: false, message: "Title is mandatory" })
        }

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is not valid" })
        }

        if (!isEmpty(description)) {
            return res.status(400).send({ status: false, message: "Description of product is mandatory" })
        }

        if (!isEmpty(price)) {
            return res.status(400).send({ status: false, message: "Price of product is mandatory" })
        }

        if (!isValidPrice(price)) {
            return res.status(400).send({ status: false, message: "Price is not present in correct format" })
        }

        if (!isEmpty(currencyId)) {
            return res.status(400).send({ status: false, message: "CurrencyId is mandatory" })
        }

        if (!isValid(currencyId)) {
            return res.status(400).sens({ status: false, message: "CurrencyId is not valid" })
        }

        if (currencyId !== "INR") {
            return res.status(400).send({ status: false, message: "CurrencyId is not correct" })
        }

        if (!isEmpty(currencyFormat)) {
            return res.status(400).send({ status: false, message: "CurrencyFormat is mandatory" })
        }

        if (!isValid(currencyFormat)) {
            return res.status(400).sens({ status: false, message: "CurrencyFormat is not valid" })
        }

        if (currencyFormat != '₹') {
            return res.status(400).send({ status: false, message: "Please enter a valid currencyFormat" })
        }

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is not valid" })
        }

        const titleCheck = await productModel.findOne({ title })
        if (titleCheck) {
            return res.status(400).send({ status: false, message: "This title is already existing" })
        }

        if (files.length == 0) {
            return res.status(400).send({ status: false, message: "Please provide product image file!!" })
        }

        let productImg = await aws.uploadFile(files[0]);
        data.productImage = productImg;

        if (!isValid(isFreeShipping)) {
            return res.status(400).sens({ status: false, message: "CurrencyId is not valid" })
        }

        if (!(isFreeShipping == "true" || isFreeShipping == "false")) {
            return res.status(400).send({ status: false, message: "Please enter a boolean value for isFreeShipping" })
        }

        if (!isValid(style)) {
            return res.status(400).sens({ status: false, message: "Style is not valid" })
        }

        if (!isValidStyle(style)) {
            return res.status(400).send({ status: false, message: "Style is not in correct format" })
        }

        if (!isEmpty(availableSizes)) {
            return res.status(400).send({ status: false, message: "Please specify the sizes which are available" })
        }

        if (availableSizes) {
            let size = availableSizes.toUpperCase().split(",")
            data.availableSizes = size;
        }

        if (!(installments || typeof installments == Number)) {
            return res.status(400).send({ status: false, message: "Installments should in correct format" })
        }

        let createProduct = await productModel.create(data);
        return res.status(201).send({ status: true, message: "Success", data: createProduct });
    }
    catch (error) {
        res.status(500).send({ status: "false", message: error.message })

    }
}


//=========================== GET API =============================//

const productsById = async function (req, res) {
    try {

        let product = req.params.productId

        if (!isValidObjectId(product)) {
            return res.status(400).send({ status: false, message: "This productId is not valid" })
        }

        const productCheck = await productModel.findById({ _id: product })
        if (!productCheck) {
            return res.status(400).send({ status: false, message: "This product is not found" })
        }

        if (productCheck.isDeleted == true) {
            return res.status(400).send({ status: false, message: "This product has been deleted" })
        }

        let getProducts = await productModel.findOne({ _id: product, isDeleted: false }).select({ deletedAt: 0 })
        return res.status(200).send({ status: true, message: "Success", data: getProducts })


    } catch (error) {
        res.status(500).send({ status: "false", message: error.message })
    }
}


//================================= UPDATE =============================//

const updateProducts = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "This productId is not valid" })
        }

        const existingProduct = await productModel.findById({ _id: productId })
        if (!existingProduct) {
            return res.status(400).send({ status: false, message: "This product is not found" })
        }

        if (existingProduct.isDeleted == true) {
            return res.status(400).send({ status: false, message: "This product has been deleted" })
        }

        let data = req.body
        let files = req.files

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: "false", message: "Please enter the data to update" });
        }

        if (data.title) {
            if (!isValid(data.title)) {
                return res.status(400).send({ status: false, message: "Title is not valid" })
            }
        }

        const titleCheck = await productModel.findOne({ title: data.title })
        if (titleCheck) {
            return res.status(400).send({ status: false, message: "This title is already existing" })
        }

        if (data.price) {
            if (!isValidPrice(data.price)) {
                return res.status(400).send({ status: false, message: "Price is not present in correct format" })
            }
        }

        if (files) {
            if (files && files.length > 0) {
                let productImg = await uploadFile(files[0]);
                data.productImage = productImg;
            }
        }

        if (data.isFreeShipping) {
            if (!(data.isFreeShipping == "true" || data.isFreeShipping == "false")) {
                return res.status(400).send({ status: false, message: "Please enter a boolean value for isFreeShipping" })
            }
        }

        if (data.style) {
            if (!isValid(data.style)) {
                return res.status(400).sens({ status: false, message: "Style is not valid" })
            }

            if (!isValidStyle(data.style)) {
                return res.status(400).send({ status: false, message: "Style is not in correct format" })
            }
        }

        if (data.availableSizes) {
            if (data.availableSizes) {
                let size = data.availableSizes.toUpperCase().split(",")
                data.availableSizes = size;
            }
        }

        if (data.installments) {
            if (!(data.installments || typeof data.installments == Number)) {
                return res.status(400).send({ status: false, message: "Installments should in correct format" })
            }
        }

        const updateProduct = await productModel.findByIdAndUpdate({ _id: productId }, data, { new: true })
        return res.status(200).send({ status: true, message: "Product Updated Successfully", data: updateProduct })

    } catch (error) {
        return res.status(500).send({ status: "false", message: error.message })

    }
}

const deleteProduct = async function(req, res) {
    try {
        const productId = req.params.productId;
        const queryParams = req.query;
        // no data is required from query params
        if (Validator.isValidInputBody(queryParams)) {
            return res.status(404).send({ status: false, message: "Page not found" });
        }
        // validating product id
        if (!Validator.isValidObjectId(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "Invalid product id" });
        }
        // checking product available by given product ID 
        const productById = await ProductModel.findOne({
            _id: productId,
            isDeleted: false,
            deletedAt: null,
        });

        if (!productById) {
            return res.status(404).send({
                status: false,
                message: "No product found by this product id",
            });
        }
        // updating product isDeleted field
        const markDirty = await ProductModel.findOneAndUpdate({ _id: productId }, { $set: { isDeleted: true, deletedAt: Date.now() } });

        res
            .status(200)
            .send({ status: true, message: "Product successfully deleted" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { createProduct, productsById, updateProducts,deleteProduct }



