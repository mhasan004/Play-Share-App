// Middleware to decrypt request fields with 
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});                     // PUBLIC + PRIVATE KEY MADE - len of the bytes
const public_key = key.exportKey('public')          // public key ------> sendout
const private_key = key.exportKey('private')        // private key
let SYMMETRIC_KEY = null;
const RSA_private_key = new NodeRSA(private_key)
const selected_headers = [
    "auth-app", 
    "auth-token"
]

exports.initiateCheckHandShake =  (req,res,next) => {
    // 1) Client making 1st request, giving them public_key 
    if (req.headers["hand-shake"] == 1){                    // handshake already performed, so its only to decrypt
        res.header('hand-shake', 1) 
        next()
    }
    else if (req.headers["hand-shake"] == null){
        res.header('pub-key', public_key) 
        res.header('hand-shake', 0)                                                                                    
        res.status(200).json({status:0, message: "Giving Client the Public Key in 'pub-key' header. Set header 'hand-shake' to 0 and send client's SYMMETRIC_KEY"})  
    }
    // 2) clint needs to return body: key=public_key_enc(SYMMETRIC_KEY). header: hand-shake=1. 
    else if (req.headers["hand-shake"] == 0 && req.body["key"] != null){
        try{ 
            SYMMETRIC_KEY = RSA_private_key.decrypt(req.headers["key"], 'utf8')// decrypt SYMMETRIC_KEY
            console.log("Got Client's SYMMETRIC_KEY!")
            return res.status(200).json({status:1, message: "Got SYMMETRIC_KEY, set header 'hand-shake' to 1 for future requests"}) 
        }        
        catch(err){
            console.log("Failed to get Client's SYMMETRIC_KEY!")
            return res.status(400).json({status:-1, message: "Couldnt decrypt client's SYMMETRIC_KEY! Set headers: key = key, hand-shake=1. Error: "+err}) 
        }
    }
    else if (req.headers["hand-shake"] == 0 && req.body["key"] == null){
        return res.status(400).json({status:-1, message: "Client-Server handshake ongoping - Client didnt send encryption key "}) 
    }
}


exports.decryptBody = async (req,res,next) =>                                                                       
{
    let errObj = null
    for (let field in req.body){
        try{
            req.body[field] = RSA_private_key.decrypt(req.body[field], 'utf8')  
        }
        catch(err){
            errObj = {
                message: `ERROR: Couldn't decrypt request body field: '${field}'! Maybe bad SYMMETRIC_KEY? \n\t\tError: ${err}`, 
                err_output_location: "DecryptBody Middleware"
            }
            console.log("Printing from decryptBody Middleware: "+errObj.message+" \n\t\terr_output_location: "+errObj.err_output_location)
            return res.status(400).json({status:-1, message: errObj}) 
        }
    }
    next()
}

exports.decryptSelectedHeader = async (req,res,next) =>                                                                       
{
    let errObj = null
    selected_headers.forEach(field=> {
        if (req.headers[field] == null){
            return res.status(400).json({status:-1, message: "Might be missing header"+field}) 
        }
        try{
            req.headers[field] = RSA_private_key.decrypt(req.headers[field], 'utf8')  
        }
        catch(err){
            errObj = {
                message: `ERROR: Couldn't decrypt request header field: '${field}'! Maybe bad SYMMETRIC_KEY? \n\t\tError: ${err}`, 
                err_output_location: "DecryptBody Middleware"
            }
            console.log("Printing from decryptSelectedHeader Middleware: "+errObj.message+" \n\t\terr_output_location: "+errObj.err_output_location)
            return res.status(400).json({status:-1, message: errObj}) 
        }
    })
    next()
}

exports.SYMMETRIC_KEY_encrypt = (data) =>{
    const encrypted_data = CryptoJS.AES.encrypt(data, SYMMETRIC_KEY).toString(); 
    return encrypted_data
}


exports.public_key = public_key;
exports.private_key = private_key;
exports.RSA_private_key = RSA_private_key;
exports.SYMMETRIC_KEY = SYMMETRIC_KEY;

















// const CryptoJS = require("crypto-js");
// const decryption_key = process.env.CLIENT_ENCRYPTION_KEY
// const selected_headers = [
//     // "auth-app", 
//     // "auth-token"
// ]
// exports.decryptBody = async (req,res,next) =>                                                                       
// {
//     let bytes = "";
//     let errObj = null
//     for (let field in req.body){
//         try{
//             bytes = CryptoJS.AES.decrypt(req.body[field], decryption_key)
//             req.body[field] = bytes.toString(CryptoJS.enc.Utf8)
//         }
//         catch(err){
//             errObj = {
//                 message: `ERROR: Couldn't decrypt request body field '${field}'!\n\t\tError: ${err}`, 
//                 err_output_location: "DecryptBody Middleware"
//             }
//             console.log("Printing from decryptBody Middleware: "+errObj.message+" \n\t\terr_output_location: "+errObj.err_output_location)
//             return res.status(400).json({status:-1, message: errObj}) 
//         }
//     }
//     next()
// }

// exports.decryptSelectedHeader = async (req,res,next) =>                                                                       
// {
//     let bytes = "";
//     let errObj = null
//     selected_headers.forEach(field=> {
//         if (req.headers[field] == null){
//             return res.status(400).json({status:-1, message: "Might be missing header"+field}) 
//         }
//         try{
//             bytes = CryptoJS.AES.decrypt(req.headers[field], decryption_key)
//             req.headers[field] = bytes.toString(CryptoJS.enc.Utf8)
//         }
//         catch(err){
//             errObj = {
//                 message: `ERROR: Couldn't decrypt request header field: '${field}' !\n\t\tError: ${err}`, 
//                 err_output_location: "DecryptBody Middleware"
//             }
//             console.log("Printing from decryptSelectedHeader Middleware: "+errObj.message+" \n\t\terr_output_location: "+errObj.err_output_location)
//             return res.status(400).json({status:-1, message: errObj}) 
//         }
//     })
//     next()
// }
