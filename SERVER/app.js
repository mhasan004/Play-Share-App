// 'use strict'                                                                                        // HTTPS
require('dotenv').config({ path: '../.env' })                                                       // To use keys stored in .env file
const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
const helmet = require("helmet")                                                                    // ngives 13 middlewares to give various protections to application
// const fs       = require('fs')                                                                   // Need this to read the files generated when running:  openssl req -nodes -new -x509 -keyout server.key -out server.cert
// const https    = require('https') 
// const path     = require('path')   
const authRoutes   = require('./routes/auth')
const adminRoutes  = require('./routes/admin')
const userRoutes   = require('./routes/user')
const getKeyRoutes = require('./routes/getKeys')
const {verifyUser, verifyAdmin, verifyApp} = require('./routes/verifyPermissions')                  // PRIVATE ROUTE MIDDLEWARE: Import the Private Routes Middleare      
const {decryptBody, decryptSelectedHeader} = require('./routes/decryptRequest')                                               // MIDDLEWARE to decrypt body

const app = express()
app.use(helmet())                                                                                   // helmet 11 middleware for protections
app.use(cors())                                                
app.use(express.json())    
// app.use('/api/getKey', getKeyRoutes)

// app.use(decryptBody, decryptSelectedHeader)                                                      // MY MIDDLEWARES to decrypt body and some headers
// app.use('/api', verifyApp)                                                                       // MY MIDDLEWARE to see if the right client
app.get('/', (req,res,next) => {                                                        // Front page testing
    res.send(JSON.stringify("<h1>MY API SERVER from Node Cluster PID:"+process.pid+"</h1>")); 
    next()
})                       
app.use('/api/auth', authRoutes)                                                                    // Register new user, login user (only apps with access key can register or login)
app.use('/api/admin', verifyUser, adminRoutes)                                                      // PRIVATE ADMIN ROUTES
app.use('/api/user/:username', verifyUser, userRoutes)                                              // PRIVATE USER ROUTES   

const port = 8000
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => {
        app.listen(port, ()=> console.log(`CONNECTED TO DB!              http://localhost:${port}     PID: ${process.pid}`))
    })
    .catch((err) => {console.log("Connection Failed! " + err)})
    