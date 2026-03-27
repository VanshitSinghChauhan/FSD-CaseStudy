const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    credits: { type: Number, required: true },
    capacity: { type: Number, default: 30 }
});

module.exports = mongoose.model('Course', courseSchema);