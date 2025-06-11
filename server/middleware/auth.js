const jwt=require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const verify=async (req,res,next) => {
    const auth=req.headers['authorization']
    if(!auth)res.status(401).json({message:'Missing token'})

    const token=auth.split(' ')[1]
    if(!token)return res.status(401).json({ message: 'Token missing' });

    try{
        const secret=jwt.verify(token, process.env.JWT_SECRET)
        req.user=secret
        next()
    }
    catch(error){
        return res.status(403).json({ message: 'Invalid token' });

    }
    
}

module.exports=verify