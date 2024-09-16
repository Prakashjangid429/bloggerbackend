const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    full_name : { type: String, required: true },
    mobile: { type: String},
    message: { type: String },
    email: { type: String ,required : true},
    company_name: { type: String},
    isResolved: { type: Boolean,default: false }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
