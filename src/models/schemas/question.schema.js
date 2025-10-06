const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    content: { type: String, required: true }
},
{ timestamps: true });

module.exports = questionSchema;