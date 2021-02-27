"use strict"
require('dotenv').config({ path: '../.env' })                                                                                           // To use keys stored in .env file
const mongoose = require('mongoose')
const PORT = process.env.PORT || 8080
const app = require('./app');

mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => {
        app.listen(PORT, ()=> console.log(`CONNECTED TO DB!     http://localhost:${PORT}     PID: ${process.pid}`))
    })
    .catch((err) => {console.log("Connection Failed! " + err)})
    

