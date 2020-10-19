// Middleware to decrypt request fields with 
const CryptoJS = require("crypto-js");

const decryption_key = process.env.CLIENT_ENCRYPTION_KEY
const selected_headers = [
    "auth-app", 
    // "auth-token"
]

exports.decryptBody = async (req,res,next) =>                                                                       
{
    let bytes = "";
    let errObj = null
    for (let field in req.body){
        try{
            bytes = CryptoJS.AES.decrypt(req.body[field], decryption_key)
            req.body[field] = bytes.toString(CryptoJS.enc.Utf8)
        }
        catch(err){
            errObj = {
                message: `ERROR: Couldn't decrypt request body field '${field}'!\n\t\tError: ${err}`, 
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
    let bytes = "";
    let errObj = null
    selected_headers.forEach(field=> {
        if (req.headers[field] == null){
            return res.status(400).json({status:-1, message: "Might be missing header"+field}) 
        }
        try{
            bytes = CryptoJS.AES.decrypt(req.headers[field], decryption_key)
            req.headers[field] = bytes.toString(CryptoJS.enc.Utf8)
        }
        catch(err){
            errObj = {
                message: `ERROR: Couldn't decrypt request header field: '${field}' !\n\t\tError: ${err}`, 
                err_output_location: "DecryptBody Middleware"
            }
            console.log("Printing from decryptSelectedHeader Middleware: "+errObj.message+" \n\t\terr_output_location: "+errObj.err_output_location)
            return res.status(400).json({status:-1, message: errObj}) 
        }
    })
    next()
}
