const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
        orderDigit: {
            type: Number,
            required: true,
        },
        orderCustomerName: {
            type: String,
            required: false,
        },
        isOrderReady: {
            type: Boolean,
            required: true,
        },
        branchId: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
            required: true,
        }
});

module.exports = mongoose.model('Order', orderSchema);