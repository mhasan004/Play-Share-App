const express      = require('express')
const cors         = require('cors')
const helmet       = require("helmet")                                                                                                  // gives 13 middlewares to give various protections to application
const morgan       = require('morgan')
const cookieParser = require('cookie-parser')                                                                                           // to parse cookie
const authRoutes   = require('./routes/auth')
const adminRoutes  = require('./routes/admin')
const userRoutes   = require('./routes/user')
const {corsOptions, rateLimiter} = require('./config')
const {verifyUser, isAdmin} = require('./helpers/VerifyPermissions')                                                                    // PRIVATE ROUTE MIDDLEWARE: Import the Private Routes Middleare      
const {decryptBody, decryptSelectedHeader, initiateCheckHandShake} = require('./helpers/EncryptDecryptFunctions')                       // MIDDLEWARE to decrypt body
const app = express()

// Setting Up Security Middlewares + Processing Request
app.use(morgan('dev'), cors(corsOptions))                                                                                               // Setting up morgan for response time logging + setting up Cors 
app.set('trust proxy', 1);                                                                                                              // (for rate limiter) enable when behind a reverse proxy 
app.use(rateLimiter, helmet());                                                                                                         // Rate limiter + htlmet's 11 middlewares to provide basic protection
app.use(cookieParser(process.env.COOKIE_SECRET), express.json())                                                                        // To parse signed cookies and request json body
if (process.env.USE_TLS === "true")
    app.use('/', initiateCheckHandShake, decryptBody, decryptSelectedHeader)                                                            // (Can disable when using HTTPS) Initilize TLS handshake and get client's Symmetric key + decrypts body and some headers

// Routes
app.use('/api/v1/auth',  authRoutes)                                                                                                    // Register new user, login user 
app.use('/api/v1/user',  verifyUser, userRoutes)                                                                                        // PRIVATE USER ROUTES   
app.use('/api/v1/admin', verifyUser, isAdmin, adminRoutes)                                                                              // PRIVATE ADMIN ROUTES
app.get('*', (req,res,next) => {res.status(404).json({status: -1, message: "404 - Route dont exist or wrong http method!"})}) 

module.exports = app;
