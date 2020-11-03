// Middleware to decrypt request fields with 
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});                     // PUBLIC + PRIVATE KEY MADE - len of the bytes
const public_key = key.exportKey('public')              // public key ------> sendout
const private_key = key.exportKey('private')            // private key
const RSA_private_key = new NodeRSA(private_key)

// const {redis_client} = require("../app")
// set data to redis cache:  redis.setex(key, expiration in secs, value)
// get data to redis cache by makign a cache middle ware
// cache middleware
// function cache(req,res, next){
//     const SYMMETRIC_KEY_DICT = 
//     redis_client(key, (err, data)={if err throiw err} if (data !== null) res.json....daat;
// }
 







const encrypted_headers = [
    "auth-token"
]
let SYMMETRIC_KEY_DICT = {}
let MAX_CLIENT_CONNECTIONS = 10

function findEmptyKey()
{
    const SYMMETRIC_KEY_DICT_ARRAY = Object.keys(SYMMETRIC_KEY_DICT).map(Number)
    const range_array = Array(MAX_CLIENT_CONNECTIONS).fill(1).map((x, y) => x + y)
    let available_keys = range_array.filter(x => !SYMMETRIC_KEY_DICT_ARRAY.includes(x)) 
    if (available_keys.length == 0){     // max client full so resize * 2
        const returnVal = MAX_CLIENT_CONNECTIONS+1
        MAX_CLIENT_CONNECTIONS = MAX_CLIENT_CONNECTIONS*2
        return returnVal
    }
    return available_keys[0]
}

/* HANDSHAKE
    * 'handshake' >= 0   --> got SYMMETRIC_KEY so continue
    * 'handshake'== null --> initiate handshake, res header = 0
    * 'handshake'== 0    --> ongoing handshake, decrypted SYMMETRIC_KEY, set 'handshake'== #
*/
exports.initiateCheckHandShake =  (req,res,next) => 
{
    // Handshake was done so can decrypt client data with SYMMETRIC_KEY
    if ((req.headers["handshake"] > 0)){                    // handshake already performed, so its only to decrypt
        res.set('handshake', req.headers["handshake"]) 
        next()
    }
    // 1) Client making 1st request, giving them public_key 
    else if (req.headers["handshake"] == null){
        res.set({
            'pub-key': Buffer.from(public_key).toString('base64'),
            'handshake': 0
        })
        return res.status(200).json({status:0, message: "Giving client the base64 encoded Public Key in 'pub-key' header. Respond with headers: 'handshake' = 0, key = base64(public_key_encypt(SYMMETRIC_KEY))"}).end()  
    }
    // 2) clint needs to return body: key=public_key_enc(SYMMETRIC_KEY). header: handshake=1. 
    else if (req.headers["handshake"] == 0 && req.headers["key"] != null){
        try{ 
            const empty_index = findEmptyKey()
            SYMMETRIC_KEY_DICT[empty_index] = RSA_private_key.decrypt(req.headers["key"], 'utf8')// decrypt SYMMETRIC_KEY
            console.log("Got Client's SYMMETRIC_KEY!")
            return res.status(200).json({status:1, handshake_index: empty_index, message: `Got SYMMETRIC_KEY! Set header: 'handshake' = ${empty_index} for future requests (see handshake_index field)`}).end() 
        }        
        catch(err){
            console.log("Failed to get Client's SYMMETRIC_KEY!")
            return res.status(400).json({status:-1 , message: "Couldnt decrypt client's SYMMETRIC_KEY with server's public key, 1) client may not have encrypted SYMMETRIC_KEY with server's public key. 2) no TLS has been made. Two options: 1) key = base64(public_key_encypt(SYMMETRIC_KEY)), handshake = handsake index. 2) handshake = 0  to reinitiate TLS handshake. Error: "+err}).end() 
        }
    }
    else if (req.headers["handshake"] == 0 && req.headers["key"] == null){
        return res.status(400).json({status:-1, message: "Client-Server handshake ongoing - Client didn't send encryption key or didnt set 'handshake' header to handshake index returned by server after client sent SYMMETRIC_KEY"}).end() 
    }
}


exports.decryptBody = async (req,res,next) =>                                                                       
{
    let err_obj = null
    let field_array = []
    let error_array = []
    for (let field in req.body){
        try{
            req.body[field] = RSA_private_key.decrypt(req.body[field], 'utf8')  
        }
        catch(err){
            field_array.push(field)
            error_array.push(err)
        }
    }
    if (field_array.length != 0){
        err_obj = {
            message: `ERROR: Couldn't decrypt request body field(s): '${field_array}'! Maybe bad SYMMETRIC_KEY? \n\t\tSError(s): ${error_array}`, 
            err_output_location: "DecryptBody Middleware"
        }
        console.log("Printing from decryptBody Middleware: "+err_obj.message+" \n\t\terr_output_location: "+err_obj.err_output_location)
        return res.status(400).json({status:-1, message: err_obj}).end()
    }
    next()
}

exports.decryptSelectedHeader = async (req,res,next) =>                                                                       
{
    let err_obj = null
    encrypted_headers.forEach(field=> {
        if (req.headers[field] == null){                                // if there is no encrypted header to decrypt, move on
            // return res.status(400).json({status:-1, message: "Might be missing header"+field}).end() 
            return
        }
        try{
            req.headers[field] = RSA_private_key.decrypt(req.headers[field], 'utf8')  
        }
        catch(err){
            err_obj = {
                message: `ERROR: Couldn't decrypt request header field: '${field}'! Maybe bad SYMMETRIC_KEY? \n\t\tError: ${err}`, 
                err_output_location: "DecryptBody Middleware"
            }
            console.log(err_obj.message+" \n\t\terr_output_location: "+err_obj.err_output_location)
            // return res.status(400).json({status:-1, message: err_obj}).end() 
        }
    })
    next()
}

exports.SYMMETRIC_KEY_encrypt = (data, handshake_index) =>{
    // return CryptoJS.AES.encrypt(data, SYMMETRIC_KEY_DICT[handshake_index]).toString(); 
    return data
}

// exports.public_key = public_key;
// exports.private_key = private_key;
// exports.RSA_private_key = RSA_private_key;
exports.SYMMETRIC_KEY_DICT = SYMMETRIC_KEY_DICT;