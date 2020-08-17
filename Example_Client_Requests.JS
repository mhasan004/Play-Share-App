//___________________________ Login/Register ROUTES ______________________________________________________________________
    // ADD A NEW USER TO DB:                        http://localhost:8080/api/auth/register                 POST    d
        {
            "username": "name",
            "email": "name@gmail.com",
            "password": "123456789"
        }

    // LOGIN:                                       http://localhost:8080/api/auth/login                    POST    d
        {
            "email": "name@gmail.com",
            "password": "123456789"
        }
        // Will set header to the JWT token
        // Will set req.user to the _id of tyhe user's doc in DB
    
//___________________________ PRIVATE ADMIN ROUTES ______________________________________________________________________
    // Need to set the 'auth-token' header with the admin's JWT token or will be denied!
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
    // need to set the 'auth-token' header with the users's JWT token or will be denied!

    // GET ALL POSTS                                http://localhost:8080/api/user/posts                   GET     d




// Further implementations: private user route to chnage pass, edit del a post



















//---------------------------------------------------------------------- test
// register admin           http://localhost:8080/api/auth/register     post
{
    "username": "admin",
    "email": "admin@gmail.com",
    "password": "123456789"
}
// LOGIN:                   http://localhost:8080/api/auth/login        post        
{
    "email": "admin@gmail.com",
    "password": "123456789"
}
    //header = Auth


http://localhost:8080/api/admin/users       get