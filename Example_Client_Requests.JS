// ADD A NEW USER TO DB:    http://localhost:8080/api/auth/register     POST
    {
        "user": "name",
        "email": "name@gmaill.com",
        "password": "123456789"
    }
    
// LOGIN:                   http://localhost:8080/api/auth/login        POST
    {
        "email": "name@aim.com",
        "password": "123456789"
    }
    // Will set header to the JWT token
    // Will set req.user to the _id of tyhe user's doc in DB

// GET PRIVATE ROUTE        http://localhost:8080/api/admin/users       GET
    // need to set the 'auth-token' header with the admin's JWT token or will be denied!







// Further implementations: private user route to chnage pass, edit del a psot
