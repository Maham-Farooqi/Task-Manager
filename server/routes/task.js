const express=require('express')
const router=express.Router()
const verify=require('../middleware/auth')
const task=require('../controllers/task')

router.get('/tasks',verify,task.displayTasks)
router.post('/tasks',verify,task.createTask)
router.put('/tasks/:id',verify,task.updateTask)
router.get('/task/:id',verify,task.findTask)
router.delete('/tasks/:id',verify,task.deleteTask)
router.patch('/tasks/:id/toggle', verify, task.toggleStatus);
router.get('/summary',verify,task.summaryTasks)


module.exports=router