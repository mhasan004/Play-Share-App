Using helmet.js on server to protect against most attacks
decryption middleware (can take off when i switch to https)

cluster


TLS: 
    1) client gets public key:
        a) generate a random hash
        b) encrypt it with public_key
        { 
            header: hand-shake = 1
            header: key = public_key_enc(random hash)
        }
    2) 


client sends token to api in bearer, need my api to read bearer and verify!

