const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storageType: {
        type: String,
        enum: ['local', 's3'],
        default: 'local'
    }
}, {
    timestamps: true
});

// Index for faster queries
fileSchema.index({ task: 1 });
fileSchema.index({ project: 1 });
fileSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('File', fileSchema);
