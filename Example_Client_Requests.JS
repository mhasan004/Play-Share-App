//___________________________ Login/Register ROUTES ______________________________________________________________________
    // Set 'auth-app' header to APP_AUTH_KEY encrypted with CLIENT_ENCRYPTION_KEY
    // ADD A NEW USER TO DB:                        http://localhost:8080/api/auth/register                 POST    d
        {
            "username": "name",       
            "email": "name@gmail.com",
            "password": "123456789"
        }
        // Client (before sending): 
            // Encrypt (with AES) the Password with the CLIENT_ENCRYPTION_KEY

    // LOGIN:                                       http://localhost:8080/api/auth/login                    POST    d
        {
            "username": "name", // OR USE EMAIL
            "password": "123456789"
        }        
        // Client (before sending): 
            // Encrypt (with AES) the Password with the CLIENT_ENCRYPTION_KEY
            // Set 'auth-token' header to the encrypted (with AES) JWT token (encrypted with CLIENT_ENCRYPTION_KEY)
    
//___________________________ PRIVATE ADMIN ROUTES ______________________________________________________________________
    // Set 'auth-token' header to the encrypted (with AES) JWT token that was generated and passed during login

    // GET ALL USERS                                http://localhost:8080/api/admin/users                   GET     d
    // GET ALL POSTS                                http://localhost:8080/api/admin/posts                   GET     d

    // GET ONE USER by _id                          http://localhost:8080/api/admin/user/:user_id           GET     d
    // GET ONE POST by _id                          http://localhost:8080/api/admin/post/:post_id           GET     d
    
    // Get All of User's Posts by username          http://localhost:8080/api/admin/user/:username/posts    GET     d            
    // Get All of User's Posts by email             http://localhost:8080/api/admin/user/:email/posts       GET     d     
    
    // Edit a user profile
    // Delete a user
    // Delete a user post (both)
  


//___________________________ PRIVATE USER ROUTES ______________________________________________________________________
    // Set 'auth-token' header to the encrypted (with AES) JWT token that was generated and passed during login

    // GET ALL POSTS                                http://localhost:8080/api/user/:username                GET     d
    // POST/ADD A POST                              http://localhost:8080/api/user/:username                POST    d
        {
            "author": "name2",
            "title": "This is my first post",
            "content": "blablabla"
        }
    // GET A POSTS                                  http://localhost:8080/api/user/:username/:post_id       GET     d
    // POST/EDIT A POSTS                            http://localhost:8080/api/user/:username/:post_id       PATCH    d




// Further implementations: private user route to chnage pass, edit del a post














//encrypt username test12
U2FsdGVkX18uYq3/8R6H2WhZN/BG5YsdiEMCjQvfdfc=

//encrypted pass of client to server: 123456789
// U2FsdGVkX1+wi8uCT2imcEeQssGetASfn+FEI1UW9sE=
// U2FsdGVkX1/z4xiaKMwQI3tg7YyDGivwNzfkW+WU9b4=
U2FsdGVkX19tUZBAJnPBgzVaMbVNwhDuXkO+57PG8+I=

// encrypted app -auth of client to server: 
U2FsdGVkX19/Di9AK7za9K9b5yHmREBNmtDItknv0rdMd/t1LwKVnI0g5w1YjYYrrxfOaQVEJbn4eMikZ/q392mvwp02+xfdtOve3Y/tR53VU30s4Xkfy0swdbbx2zzyEnde/z655rSStOJjwLT0MInZG8srw/UKmXQd6ztKJAARk28cSbrP0Q8u+pkEPSSWUzlDwlnDQuJ8PQbcGzb3lW+XCzN8TQwsYup9TONwhohbVA7BeGGgyWVk127AC0i+l1iAcNCOFjFrRh9iZMeWoYzKMaQsN1HGKtOZo14lIEkuvA4X1wZtgYi5e0EtWeEgZeRDkC30SYrGTgm/WaIo/A==


//---------------------------------------------------------------------- test
// register admin           http://localhost:8080/api/auth/register     post
{
    "username": "admin",
    "email": "admin@gmail.com",
    "password": "123456789"
}
{
    "username": "name1",
    "email": "name@gmail.com",
    "password": "123456789"
}
// LOGIN:                   http://localhost:8080/api/auth/login        post        
{
    "email": "admin@gmail.com",
    "password": "123456789"
}
    //header = Auth


http://localhost:8080/api/admin/users       get




http://localhost:8080/api/user/name1   get