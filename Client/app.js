require('dotenv').config({ path: '../.env' })
const express  = require('express') 
const path     = require('path')                                                  // Absolute path to this directory    
const fs          = require('fs')                                                       // Need this to read the files generated when running:  openssl req -nodes -new -x509 -keyout server.key -out server.cert
const https       = require('https')  
const authRoutes = require('./routes/auth');

const app = express()   
app.use(express.json())   
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')))                                 // TO LINK CSS FILES IN HTML FILES express.static(...path...) gives a folder read access (static file now) so it can be accessed from anywhere!

app.use('/api/auth', authRoutes)     


const port = 3005    
const server_key = path.join(__dirname, '../', 'server.key')
const server_cert = path.join(__dirname, '../', 'server.cert')
const https_options = {
    key: fs.readFileSync(server_key),
    cert: fs.readFileSync(server_cert)
}

// https.createServer(https_options, app).listen(port, ()=> {
//     console.log(`Client is running at port: http://localhost:${port}   http://localhost:${port}/api/auth/register   http://localhost:${port}/api/auth/login`)                      
// })

app.listen(port, ()=>{
    console.log(`Client is running at port: http://localhost:${port}   http://localhost:${port}/api/auth/register   http://localhost:${port}/api/auth/login`)                      
})
