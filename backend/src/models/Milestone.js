const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a milestone title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    status: {
        type: String,
        enum: ['planning', 'in-progress', 'completed', 'on-hold'],
        default: 'planning'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: [true, 'Please provide a due date']
    },
    completedDate: {
        type: Date
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    color: {
        type: String,
        default: '#3B82F6'
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes
milestoneSchema.index({ project: 1, status: 1 });
milestoneSchema.index({ dueDate: 1 });

// Virtual for overdue status
milestoneSchema.virtual('isOverdue').get(function () {
    if (this.status === 'completed' || !this.dueDate) return false;
    return new Date() > this.dueDate;
});

// Method to calculate progress based on tasks
milestoneSchema.methods.calculateProgress = async function () {
    const Task = mongoose.model('Task');
    const tasks = await Task.find({ milestone: this._id });

    if (tasks.length === 0) {
        this.progress = 0;
        return 0;
    }

    const completedTasks = tasks.filter(task => task.status === 'done').length;
    this.progress = Math.round((completedTasks / tasks.length) * 100);

    return this.progress;
};

module.exports = mongoose.model('Milestone', milestoneSchema);
