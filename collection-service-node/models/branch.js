const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const branchSchema = new Schema({
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        lastOrderDigit: {
            type: Number,
            required: true,
        },
        orders: [
            {
                orderId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Order',
                    required: true,
                }
            }
        ],
});

module.exports = mongoose.model('Branch', branchSchema);