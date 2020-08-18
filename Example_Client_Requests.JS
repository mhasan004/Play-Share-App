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
        // FOR USER: 
            // Will create a hashed User JWT Secret Key, which will be used to create JWT. This secret key is hashed using user profile data and USER_SECRET_KEY stored in .env
            // User JWT Secret Key is hashed once again using salt and is then stored in db
        // FOR ADMIN:
            // JWT is created using ADMIN_SECRET_KEY, which is stored in .env
            // Unlike user, no JWT Secret Key is stored in db for admin
        // req.user = _id of the user's doc in DB
    
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

    // GET ALL POSTS                                http://localhost:8080/api/user/:username                GET     d
    // ADD A POST                                   http://localhost:8080/api/user/:username                POST    d
        {
            "author": "name2",
            "title": "This is my first post",
            "content": "blablabla"
        }
    // GET A POSTS                                  http://localhost:8080/api/user/:username/:post_id       GET     d
    // EDIT A POSTS                                 http://localhost:8080/api/user/:username/:post_id       PATCH    d




// Further implementations: private user route to chnage pass, edit del a post



















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