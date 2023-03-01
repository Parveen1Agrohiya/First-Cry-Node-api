const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'categoryData',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: String
        // required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('productListData',productSchema);