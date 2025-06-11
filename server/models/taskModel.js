const mongoose=require('mongoose')

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending',  'Completed'],
        default: 'Pending'
    },
    priority: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High']
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   
});

taskSchema.index({ userid: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);