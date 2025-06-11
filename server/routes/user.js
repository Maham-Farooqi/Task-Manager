const express=require('express')
const router=express.Router()
const verify=require('../middleware/auth')

const user=require('../controllers/user')

router.post('/register',user.register)
router.post('/login',user.login)

router.get('/profile',verify,user.profile)


module.exports=router