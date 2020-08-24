const CryptoJS = require("../node_modules/crypto-js");
const fetch    = require('../node_modules/node-fetch/lib') 
const path     = require('path')                                                  // Absolute path to this directory    

const login_page_path = path.join(__dirname, "../", "views", "login.html") 

exports.getLogin = (req,res,next) =>{
    res.sendFile(login_page_path) 
}

exports.getRegister = (req,res,next) =>{
    res.sendFile(login_page_path) 
}    

/*
exports.postRegister = async (req,res,next) =>{
    const rest_url_base = "http://localhost:8080"
    const register_path = "/api/auth/register" 

    const encrypted_username = CryptoJS.AES.encrypt(req.body.username, process.env.CLIENT_ENCRYPTION_KEY).toString()
    const encrypted_email    = CryptoJS.AES.encrypt(req.body.email, process.env.CLIENT_ENCRYPTION_KEY).toString()
    const encrypted_pass     = CryptoJS.AES.encrypt(req.body.password, process.env.CLIENT_ENCRYPTION_KEY).toString()
    const encrypted_auth_app_header = CryptoJS.AES.encrypt( process.env.APP_AUTH_KEY, process.env.CLIENT_ENCRYPTION_KEY).toString()       


    try{ 
        const response = await fetch(rest_url_base+register_path, {                                                         // POST REQUEST needs a dictionary as a fetch parameter
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-type': 'application/json',
                'auth-app': encrypted_auth_app_header
            },
            body: JSON.stringify({
                "username": encrypted_username,
                "email":    encrypted_email,
                "password": encrypted_pass
            })
        })
        const res_json = await response.json()                                                                              // see if successful 
        console.log(res_json)
    }
    catch(err){
        console.log(err)
    }
}


exports.postLogin = async (req,res,next) =>{
    const rest_url_base = "http://localhost:8080"
    const login_path = "/api/auth/login" 
    const user_path = "/user"

    const encrypted_username = CryptoJS.AES.encrypt(req.body.username, process.env.CLIENT_ENCRYPTION_KEY).toString()
    const encrypted_pass = CryptoJS.AES.encrypt(req.body.password, process.env.CLIENT_ENCRYPTION_KEY).toString()
    const encrypted_auth_app_header = CryptoJS.AES.encrypt( process.env.APP_AUTH_KEY, process.env.CLIENT_ENCRYPTION_KEY).toString()       

    try{ 
        const response = await fetch(rest_url_base+login_path, {                                                            // 1) Send login details to the server
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-type': 'application/json',
                'auth-app': encrypted_auth_app_header
            },
            body: JSON.stringify({
                "username": encrypted_username,
                "password": encrypted_pass
            })
        })
        
        const res_json = await response.json()                                                                              // see if successful log in or not
        console.log(res_json)

        if (res_json.status === 1){
            const res_header_token = (await response.headers).get('auth-token')                                             // 2) Getting the encrypted JWT token from header
            const bytes = CryptoJS.AES.decrypt(res_header_token,  process.env.SERVER_ENCRYPTION_KEY);                       // Decrypting token 
            const token = bytes.toString(CryptoJS.enc.Utf8);   
           
            const enc_token = CryptoJS.AES.encrypt(token,  process.env.CLIENT_ENCRYPTION_KEY);                              // 3) Encrypt token to be sent to server
            res.header('auth-token', enc_token)                                                                             // 4) Setting token as header 
            // res.redirect(`${rest_url_base}${user_path}${req.body.username}`)
        }
        if (res_json.status === 0){
            res.send("Invalid login")
        }
    }
    catch(err){
        console.log(err)
    }
}*/