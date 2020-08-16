require('dotenv/config') 
const express     = require('express')
const mongoose    = require('mongoose')
const authRoutes  = require('./routes/auth')
const adminRoutes = require('./routes/admin')
// const userRoutes  = require('./routes/user')
const {verifyPermissions}= require('./routes/verifyPermission')                        // PRIVATE ROUTE MIDDLEWARE: Import the Private Routes Middleare      

const app = express()
app.use(express.json())    

app.use('/api/auth', authRoutes)                                                        // Register new user, login user
app.use('/api/admin', verifyPermissions, adminRoutes)                               // PRIATE ADMIN ROUTES
// app.use('/api/user', verifyPermissions, userRoutes)                                 // PRIATE USER ROUTES   




const port = 8080
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => app.listen(port, ()=> console.log(`CONNECTED TO DB!              http://localhost:${port}`)))
    .catch((err) => {console.log("Connection Failed! err = " + err)})
    
