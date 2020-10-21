# Play Share App
* This is a Reddit/Imgur-like app where gamers can share short clips of their game plays. Users can join different game groups just like reddit. App will feature an hierarchical commenting system
* Server: REST API built with Node, Express, MongoDB. Will migrate database to PostgresSQL. Client: Currently being built with React
* Implemented various security features to secure HTTP requests and responses. (Didn't use HTTPS on purpose to have fun implementing security features). This implementation can easily be disabled by disabling the middleware. 
* Hosted a clustered REST API server on DigitalOcean and used NGINX as a reverse Proxy. Enabled HTTPS. 

<br/>

![Login & Register Page Demo](login_register_demo2.gif)

<div style="text-align:center;   font-style: italic;">
    Fig 1:  Login & Registration Demo 

  (Changes from demo: Database will only indicate if user is logged in or not. 'secret_key' as seen in the demo is no longer stored )
</div>

# 📌 TECHNOLOGIES USED:
* The REST API Server is built using **Node**, **Express**, and **Mongoose**
* The Client side is still in production and is being built with **React**
* **helmet.js** - used to give some basic security to REST API application.
* **node-rsa** - used to create asymmetric RSA keys to initiate TLS handshake between client and server. 
* **bcrypt** - used to store hashed passwords and portion of key needed to make JWT into the database.
* **crypto-js** - used to encrypt response and decrypt request using the client's symmetric key (AES).
* **JWT** - used to authenticate a user.
* **Joi** - used to validate client request body.

# 📋 APPLICATION OVERVIEW:
* The login and register process is explained in the **APP SECURITY** section.
* To access the user or admin private routes, the client must supply the valid JWT token in the **auth-token** header (can be sent encrypted with SYMMETRIC_KEY). JWT expire after one hour. 
* Users can make a posts, edit their own posts, delete a post, see all of their posts, and like other user's posts. User feed is currently in production.
* Admin can see all user's posts, see only a specific user's posts, and delete one or many posts by id. 

# 🏠 RUN SERVER LOCALLY:
1) Rename ***.env.example*** to ***.env***. Can modify all eight variables but must change the **DB_CONNECT** variable so that you can connect to your Mongo Database. Make sure the keys are long and randomly generated. 
    <details>      
      <summary> Description of the variables (Will not need most of this when using https)</summary>
    
      * `DB_CONNECT`  - Store your MongoDB Connection URL
      * `ADMIN_EMAIL` - This is the email address of the admin account.
      * `ADMIN_SECRET_KEY` - (Will be hashed every hour) This will be used to make the admin's JWT 
      * `USER_SECRET_KEY`  - (Will be hashed every hour) This will be used to make the admin's and user's JWT
      * `SALT_NUM = 10`    - Can keep this as is. This is the salt number to hash the password and the JWT User Secret Key to store in the database. Can change this number every year to change the hashing algorithm of these fields.
    </details>
2) `npm install` on the ***CLIENT_REACT*** and ***SERVER*** directories
3) `npm start` on the ***CLIENT_REACT*** and ***SERVER*** directories to run the client and server 
<br/>

# 🛡️ APP SECURITY:
  ![TLS Handshake](/Pictures/My_TLS_Handshake2.png)
  <div style="text-align:center;   font-style: italic;">
    Fig 2:  TLS Handshake I implemented on the server. Client in development.
  </div>

  * TLS handshake can be performed but is not needed since server and client will communicate over https. Implemented basic version of TLS for fun
    <details>      
      <summary> TLS Handshake Process </summary>

    1. Client sends initial request to server (/auth/ routes only).
    2. Server generates RSA public and private keys and send to public key to client:
      * 1) header `hand-shake` = 0
      * 2) header `pub_key` = public key
    3. Client generates a random hash (`SYMMETRIC_KEY`) and encrypts with public key and sends request to server with two headers: 
      * 1) header `hand-shake` = 0
      * 2) header `key` = `SYMMETRIC_KEY` encrypted with public key
    4. Server will then decrypt the `SYMMETRIC_KEY` with the private key and will send a response with header `hand-shake` = 1, signifying handshake completed for server.
    5. Client will finish by sending a request with header `hand-shake` = 1, signifying it has received the server's message
    6. Server will only fulfill requests for auth routes if the `hand-shake` header is set to 1. This means that server has the client's `SYMMETRIC_KEY` and can decrypt request. If server cannot decrypt request, the `SYMMETRIC_KEY` is incorrect and server will refuse request. 
    7. Symmetric keys are stored in a dictionary in the server (will move it to a key-value database). If user logs out, entry is deleted

    </details>
    

  * To login, two pieces of information need to be valid: 
    1. Correct JWT for user (expires during logout),
    2. Valid `SYMMETRIC_KEY` (or else it will remake one through TLS handshake), deleted during logout.

  * All data in requests and responses are AES encrypted by the symmetric key.
  * JWT expires every hour.
  * Encryption keys needed to make JWT and hash passwords are over 400 characters long and are stored in the **.env** file. The encryption keys are concatenations of several randomly generated hashes. 
  * During registration and login phase, all user inputs are validated using **Joi**.
  * During registration, passwords are hashed and stored in the database. 
  * Admin and user JWT are created differently. 
    * User JWT is created by encrypting user's _id with `USER_ENCRYPTION_KEY` key. 
    * Admin JWT uses the same process but it's encryption key is the AES encryption of `USER_ENCRYPTION_KEY` with the `ADMIN_ENCRYPTION_KEY`. 
    * Logged in users are marked on the database to avoid tampering.
  
  <details>      
    <summary style="padding-left: 25px;"> FIXES IN DEVELOPMENT: </summary>

  * Using Authentication Headers 
  * `ADMIN_SECRET_KEY`, `USER_SECRET_KEY`
  * Add salt so user string to increase the randomness of JWT
  </details>
<br/>

# 📐 USABILITY (CLIENT REQUESTS):
* **Client Headers & Body:** Send encrypted authentication code to server through the header
  * To make any requests to the server, the application needs to have the valid access key.
  * Header `hand-shake` =  
    * nothing - to initiate TLS handshake
    * `0` - to  say sending client's symmetric key to server 
    * `hand_shake_index` - this is sent by server after successful TLS handshake 
  * Header `auth-token` = encrypt (with AES and the symmetric key) the JWT given by the server during login. This lets you access user routes.
  * Header `Content-Type` = `application/json`
  * AES encrypt the post request body with the symmetric key
  


