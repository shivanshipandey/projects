const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    price: { // valid number decimal
        type: Number,
        required: true,
        trim: true
    },

    currencyId: { //INR
        type: String,
        required: true,
        trim: true
    },

    currencyFormat: { //Rupee symbol
        type: String,
        required: true,
        trim: true
    },

    isFreeShipping: {
        type: Boolean,
        default: false
    },

    productImage: { // s3 link
        type: String,
        required: true,
        trim: true
    },

    style: {
        type: String,
        trim: true
    },

    availableSizes: [{ //at least one size
        type: String,
        trim: true,
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
    }],

    installments: {
        type: Number,
        trim: true
    },

    deletedAt: {  
        type: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)