Using helmet.js on server to protect against most attacks
decryption middleware (can take off when i switch to https)

// chnaged JWT auth:
JWT need: data to encrypt, secret key, expiration
    // data_to_encrypt: (string of usernmae + _id)
    // unique_user_secret_key for users = AES(data_to_encrypt, USER_SECRET_KEY)
    // unique_user_secret_key for admin = AES(unique_user_secret_key, ADMIN_SECRET_KEY)  -----> AES(AES(data_to_encrypt, USER_SECRET_KEY),ADMIN_SECRET_KEY) 
    token = jwt.sign({id: data_to_encrypt}, unique_user_secret_key, {expiresIn: '1h'})   

    // STORE THE HASHED unique_user_secret_key to db
    // send encrypted jwt to client

client sends token to api in bearer, need my api to read bearer and verify!

