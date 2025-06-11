const express=require('express')
const mongoose=require('mongoose')
const cors = require('cors');
const dotenv=require('dotenv')
dotenv.config();

const app=express()

const userRoute=require('./routes/user')
const taskRoute=require('./routes/task')

app.use(express.json())
app.use(cors())

app.use('/user', userRoute);
app.use('/task', taskRoute);

let connection=mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected!'));
const port = process.env.PORT 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})