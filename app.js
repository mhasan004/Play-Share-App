require('dotenv/config') 
const express    = require('express')
const mongoose   = require('mongoose')
const authRoutes = require('./routes/auth')
const app = express()

app.use(express.json())                                                             
app.use('/api/user', authRoutes)


const port = 8080
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    .then( () => app.listen(port, ()=>{
        console.log(`http://localhost:${port}           http://localhost:${port}/api/user/register     `)
    }))
    .catch((err) => {console.log("Connection Failed! err = " + err)})
    





// password needs top be hashed or it will be shown in plain text in the DB
// there is no validation of the schema yet so ppl can write passwords thats only one char instead of 6

// npm install @hapi/joi