"use strict"
require('dotenv').config({ path: '../.env' })                                                       // To use keys stored in .env file
const express      = require('express')
const mongoose     = require('mongoose')
const cors         = require('cors')
const helmet       = require("helmet")                                                              // gives 13 middlewares to give various protections to application
const morgan       = require('morgan')                                                              // middleware to log request/responses. can see how long it tookf or api to respond and optimize endpoints
const cookieParser = require('cookie-parser')                                                       // to parse cookie
const authRoutes   = require('./routes/auth')
const adminRoutes  = require('./routes/admin')
const userRoutes   = require('./routes/user')
const {verifyUser, verifyAdmin, verifyApp, checkOrigin} = require('./helpers/verifyPermissions')                        // PRIVATE ROUTE MIDDLEWARE: Import the Private Routes Middleare      
const {decryptBody, decryptSelectedHeader, initiateCheckHandShake} = require('./helpers/EncryptDecryptRequest')         // MIDDLEWARE to decrypt body
const CLIENT_URL =  'http://localhost:3000'
const PORT = process.env.PORT || 8000
const app  = express()
// module.exports.CLIENT_URL = CLIENT_URL

app.use(morgan('dev'))                                                                              // logs response time
app.use(cors( /*{origin: CLIENT_URL, credentials: true} */));                                       // Only accept requests from the specific client domain (i hope :/)

app.use(helmet())                                                                                   // helmet comes with 11 middleware for basic protecting response (gets rid of reponse headers to give basic security to app)
app.use(express.json())                                                                             // parse request as json
app.use(cookieParser(process.env.COOKIE_SECRET))                                                    // to parse cookies. signing cookies

app.get('/', (req,res,next) => {res.send(JSON.stringify("<h1>MY API SERVER from Node Cluster PID:"+process.pid+"</h1>"))}) 
// app.use('/', initiateCheckHandShake)                                                             // (Can disable when using HTTPS) Initilize TLS handshake and get client's Symmetric key       
// app.use('/api/auth', decryptBody, decryptSelectedHeader)                                         // (Can disable when using HTTPS) My MIDDLEWARES to decrypt body and some headers for login and request
app.use('/api/auth', authRoutes)                                                                    // Register new user, login user 
app.use('/api/user/:username', verifyUser, userRoutes)                                              // PRIVATE USER ROUTES   
app.use('/api/admin', verifyUser, adminRoutes)                                                      // PRIVATE ADMIN ROUTES
app.get('*', (req,res,next) => {res.status(404).json({status: -1, message: "404 - Route dont exist or wrong http method!"})}) 

mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => {
        app.listen(PORT, ()=> console.log(`CONNECTED TO DB!              http://localhost:${PORT}     PID: ${process.pid}`))
    })
    .catch((err) => {console.log("Connection Failed! " + err)})
    
