require('dotenv/config') 
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const app = express()

app.use('/api/user', authRoutes)


const port = 8080
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => app.listen(port, ()=>{
        console.log(`http://localhost:${port}           http://localhost:${port}/api/user/register     `)
    }))
    .catch((err) => {console.log("Connection Failed! err = " + err)})
    




