"use strict"
require('dotenv').config({ path: '../.env' })                                                                                           // To use keys stored in .env file
const express      = require('express')
const mongoose     = require('mongoose')
const cors         = require('cors')
const helmet       = require("helmet")                                                                                                  // gives 13 middlewares to give various protections to application
const morgan       = require('morgan')                                                                                                  // middleware to log request/responses. can see how long it tookf or api to respond and optimize endpoints
const cookieParser = require('cookie-parser')                                                                                           // to parse cookie
const {corsOptions, rateLimiter} = require('./config')
const authRoutes   = require('./routes/auth')
const adminRoutes  = require('./routes/admin')
const userRoutes   = require('./routes/user')
const {verifyUser, verifyAdmin} = require('./helpers/VerifyPermissions')                                                     // PRIVATE ROUTE MIDDLEWARE: Import the Private Routes Middleare      
const {decryptBody, decryptSelectedHeader, initiateCheckHandShake} = require('./helpers/EncryptDecryptRequest')                         // MIDDLEWARE to decrypt body
const PORT = process.env.PORT || 8000
const app  = express()

// Setting Up Security Middlewares + Request Processing
app.use(morgan('dev'))                                                                                                                  // logs response time
app.use(cors(corsOptions));                                                                                                             // Only accept requests from the specific client domain
app.set('trust proxy', 1);                                                                                                              // (for rate limiter) enable when behind a reverse proxy 
app.use(rateLimiter);                                                                                                                   // (for rate limiter) to accpept reverse proxy
app.use(helmet())                                                                                                                       // helmet comes with 11 middleware for basic protecting     ponse (gets rid of reponse headers to give basic security to app)
app.use(cookieParser(process.env.COOKIE_SECRET))                                                                                        // To parse signed cookies
app.use(express.json())                                                                                                                 // parse request as json

if (process.env.USE_TLS === "True"){
    app.use('/', initiateCheckHandShake)                                                                                                // (Can disable when using HTTPS) Initilize TLS handshake and get client's Symmetric key       
    app.use('/', decryptBody, decryptSelectedHeader)                                                                                    // (Can disable when using HTTPS) My MIDDLEWARES to decrypt body and some headers for login and request
}
    
// Routes
app.get('/', (req,res,next) => {res.send(JSON.stringify("<h1>MY API SERVER from Node Cluster PID:"+process.pid+"</h1>"))}) 
app.use('/api/v1/authUser', verifyUser)                                                                                                 // Endpoint for client to just check user status
app.use('/api/v1/auth', authRoutes)                                                                                                     // Register new user, login user 
app.use('/api/v1/user', verifyUser, userRoutes)                                                                                         // PRIVATE USER ROUTES   
app.use('/api/v1/admin', verifyUser, verifyAdmin, adminRoutes)                                                                          // PRIVATE ADMIN ROUTES
app.get('*', (req,res,next) => {res.status(404).json({status: -1, message: "404 - Route dont exist or wrong http method!"})}) 

// Server
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => {
        app.listen(PORT, ()=> console.log(`CONNECTED TO DB!     http://localhost:${PORT}     PID: ${process.pid}`))
    })
    .catch((err) => {console.log("Connection Failed! " + err)})
    
