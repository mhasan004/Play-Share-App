require('dotenv/config') 
const express    = require('express')
const mongoose   = require('mongoose')
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/admin')
const {verifyAdmin, verifyUser} = require('./routes/verifyUser')                       // 1) PRIVATE ROUTE MIDDLEWARE: Import the Private Routes Middleare      

const app = express()

app.use(express.json())                                                             
app.use('/api/signin', authRoutes)                                                   // Register new user, login user
app.use('/api/admin', verifyAdmin, postRoutes)                           // 2) PRIATE ROUTE: Add the Private middle ware to the middle of the router


const port = 8080
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => app.listen(port, ()=>{
        console.log(`http://localhost:${port}           http://localhost:${port}/api/user/register     `)
    }))
    .catch((err) => {console.log("Connection Failed! err = " + err)})
    
