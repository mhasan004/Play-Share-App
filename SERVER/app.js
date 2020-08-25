require('dotenv').config({ path: '../.env' })
const express  = require('express')
const mongoose = require('mongoose')
const fs       = require('fs')                                                       // Need this to read the files generated when running:  openssl req -nodes -new -x509 -keyout server.key -out server.cert
const https    = require('https') 
const path     = require('path')    
const cors     = require('cors')

const authRoutes  = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const userRoutes  = require('./routes/user')
const {verifyUser, verifyAdmin, verifyApp} = require('./routes/verifyPermissions')       // PRIVATE ROUTE MIDDLEWARE: Import the Private Routes Middleare      

const app = express()
app.use(cors())
app.use(express.json())    

app.use('/api/auth',  verifyApp, authRoutes)                                            // Register new user, login user (only apps with access key can register or login)
app.use('/api/admin', verifyApp, verifyUser, adminRoutes)                                         // PRIVATE ADMIN ROUTES
app.use('/api/user/:username', verifyApp, verifyUser, userRoutes)                                  // PRIVATE USER ROUTES   

const port = 8080
// const server_key = path.join(__dirname, '../', 'server.key')
// const server_cert = path.join(__dirname, '../', 'server.cert')
// const https_options = {
//     key: fs.readFileSync(server_key),
//     cert: fs.readFileSync(server_cert)
// }
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => {
        // https.createServer(https_options, app).listen(port, () => {
        //     console.log(`CONNECTED TO DB!              https://localhost:${port}`)
        // })
        app.listen(port, ()=> console.log(`CONNECTED TO DB!              http://localhost:${port}`))
    })
    .catch((err) => {console.log("Connection Failed! " + err)})
    
// chnage password need to change user secret key + pasword itself
// replay using trees