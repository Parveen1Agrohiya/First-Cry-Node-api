const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    gender: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'productListData'
        // required: true
    }],
});

module.exports = mongoose.model('categoryData',categorySchema);