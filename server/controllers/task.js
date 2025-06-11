const Task = require('../models/taskModel')

const displayTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userid: req.user.userid });
        if (!tasks.length) {
            return res.status(404).json({ message: "No tasks found" });
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    const { name, description, dueDate, status, priority } = req.body;
    console.log( name, description, dueDate, status, priority)
    try {
        const task = new Task({
            name,
            description,
            dueDate,
            status,
            priority,
            userid: req.user.userid,
        });
        await task.save();
        res.status(201).json({ message: 'Task Created', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    const { name, description, dueDate, status, priority } = req.body;
    const taskId = req.params.id;

    try {
        const task = await Task.findOne({ _id: taskId, userid: req.user.userid });
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });

        if (name) task.name = name;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = status;
        if (priority) task.priority = priority;

        await task.save();
        res.status(200).json({ message: 'Task Updated', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findOne({ _id: taskId, userid: req.user.userid });
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });

        await Task.deleteOne({ _id: taskId });
        res.status(200).json({ message: 'Task Deleted', deletedTask: task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const toggleStatus = async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findOne({ _id: taskId, userid: req.user.userid });
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });

        task.status = task.status === 'Completed' ? 'Pending' : 'Completed';

        await task.save();

        res.status(200).json({ message: 'Task status toggled', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const summaryTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userid: req.user.userid });
        if (!tasks.length) {
            return res.status(404).json({ message: "No tasks found" });
        }
        const taskData = {
            total: tasks.length,
            completed: 0,
            pending: 0,
            dueToday: 0
        };
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        tasks.forEach(task => {
            if (task.status === 'Completed') taskData.completed++;
            if (task.status === 'Pending') taskData.pending++;

            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);
            if (due.getTime() === today.getTime()) {
                taskData.dueToday++;
            }
        });


        res.status(200).json(taskData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const findTask = async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findOne({ _id: taskId, userid: req.user.userid });
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    displayTasks, createTask, updateTask, deleteTask, toggleStatus, summaryTasks,findTask
};