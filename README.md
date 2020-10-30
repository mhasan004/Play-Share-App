# Play Share App
* This is a Reddit/Imgur-like app where gamers can share short clips of their game plays. Users can join different game groups just like reddit. App will feature an hierarchical commenting system
* Server: REST API built with Node, Express, MongoDB. Will migrate database to PostgresSQL. Client: Currently being built with React
* Implemented various security features to secure HTTP requests and responses. (Didn't use HTTPS on purpose to have fun implementing security features). This implementation can easily be disabled by disabling the middleware. 
* Hosted a clustered REST API server on DigitalOcean and used NGINX as a reverse Proxy. Enabled HTTPS. 

<br/>

![Login & Register Page Demo](/PicturesGifs/login_register_demo2.gif)

<div style="text-align:center;   font-style: italic;">
    Fig 1:  Login & Registration Demo 

  (Changes from demo: Database will only indicate if user is logged in or not. 'secret_key' as seen in the demo is no longer stored )
</div>

# 📌 TECHNOLOGIES / DEPENDENCIES:
* The REST API Server is built using **Node**, **Express**, and **Mongoose**
* The Client side is still in production and is being built with **React**
* **helmet.js** - used to give some basic security to REST API application.
* **node-rsa** - used to create asymmetric RSA keys to initiate TLS handshake between client and server. 
* **bcrypt** - used to store hashed passwords and portion of key needed to make JWT into the database.
* **crypto-js** - used to encrypt response and decrypt request using the client's symmetric key (AES).
* **JWT** - used to authenticate a user - used to make user access and refresh tokens.
* **Joi** - used to validate client request body.
* **cookie-parser** - used to parse refresh token cookie data from request.

# 📋 APPLICATION OVERVIEW:
* The login and register process is explained in detail in the **APP SECURITY** section.
* To access the user or admin private routes, the client must supply the valid JWT token in the **auth-token** header (can be sent encrypted with SYMMETRIC_KEY). JWT expire every 10 minutes. Refresh token in cookie can be used to refresh tokens.  
* Users can make a posts, edit their own posts, delete a post, see all of their posts, and like other user's posts. User feed is currently in production. Uploading video and images to S3 bucket in development. 
* Admin can see all user's posts, see only a specific user's posts, and delete one or many posts by id. 

# 🏠 RUN SERVER LOCALLY:
1) Rename ***.env.example*** to ***.env***. Can modify all eight variables but must change the **DB_CONNECT** variable so that you can connect to your Mongo Database. Make sure the keys are long and randomly generated. 
    <details>      
      <summary> Description of the variables (Will not need most of this when using https)</summary>
    
      * `DB_CONNECT`  - Store your MongoDB Connection URL
      * `ADMIN_EMAIL` - This is the email address of the admin account.
      * `ADMIN_SECRET_KEY` - This will be used to make the admin's access JWT
      * `USER_SECRET_KEY`  - This will be used to make the admin's and user's access JWT
      * `REFRESH_TOKEN_SECRET` - This is used to generate a refresh JWT refresh
      * `SALT_NUM = 10`    - Can keep this as is. This is the salt number to hash the password and the JWT User Secret Key to store in the database. Can change this number every year to change the hashing algorithm of these fields.
    </details>
2) `npm install` on the ***CLIENT_REACT*** and ***SERVER*** directories
3) `npm start` on the ***CLIENT_REACT*** and ***SERVER*** directories to run the client and server 
<br/>

# 🛡️ APP SECURITY:
  ![TLS Handshake](/PicturesGifs/My_TLS_HandshakeP.png)
  <div style="text-align:center;   font-style: italic;">
    <center> Fig 2:  TLS Handshake I implemented on the server. Client in development. <center>
  </div>

## TLS handshake (optional, can disable if using https):
  * TLS handshake can be performed but is not needed since server and client will communicate over https. Implemented basic version of TLS for fun
    <details>      
      <summary> TLS Handshake Process </summary>

    1. Client sends initial request to server (/auth/ routes only).
    2. Server generates RSA public and private keys and send to public key to client:
      * 1) header `handshake` = 0
      * 2) header `pub_key` = public key
    3. Client generates a random hash (`SYMMETRIC_KEY`) and encrypts with public key and sends request to server with two headers: 
      * 1) header `handshake` = 0
      * 2) header `key` = `SYMMETRIC_KEY` encrypted with public key
    4. Server will then decrypt the `SYMMETRIC_KEY` with the private key and will send a response with header `handshake` = 1, signifying handshake completed for server.
    5. Client will finish by sending a request with header `handshake` = 1, signifying it has received the server's message
    6. Server will only fulfill requests for auth routes if the `handshake` header is set to 1. This means that server has the client's `SYMMETRIC_KEY` and can decrypt request. If server cannot decrypt request, the `SYMMETRIC_KEY` is incorrect and server will refuse request. 
    7. Symmetric keys are stored in a dictionary in the server (will move it to a key-value database). If user logs out, entry is deleted

    </details>

## Authentication via JWT and Refresh Tokens:

  * After successful login, access token and refresh tokens are made. Refresh tokens lets the application silently refresh expired JWT given that the refresh token is valid.
  * **Admin and User's JWTs are created differently:**
    * User access JWT is created using the user's username and signed with the `USER_ENCRYPTION_KEY` key. 
    * Admin access JWT uses the same process but signs the token using the AES encryption of `USER_ENCRYPTION_KEY` with the `ADMIN_ENCRYPTION_KEY`.
    * Sent to the client in a Authentication Bearer header. Client stores the token in memory. 
  * **Refresh Tokens & Silent Refresh Procedure**: 
    * Refresh JWT is created using the the user's username and email address and signed with the `REFRESH_TOKEN_SECRET` key. It is stored in a database.
    * It is stored in httpOnly cookie with `httpOnly=true`, `sameSite: 'strict'`, `secure: true` flags set so that it cannot be accessed by the client. 
    * If JWT expires, client will send a request to the `/auth/refresh` endpoint along with the httpOnly cookie that contains the refresh token. 
      * If the token is valid and exists in the database, a new refresh token will be created and will replace the old refresh token in the database.
      * A new access JWT is created and these are sent to the client. 
  

 * <details>      
      <summary> SUMMARY </summary>

      * To login or use private routes, two pieces of information need to be valid: 
        1. Correct access JWT for user (expires every 10 minutes and logout),
        2. (optional if using TLS) Valid `SYMMETRIC_KEY` (or else it will remake one through TLS handshake), deleted during logout.
      * (optional if using TLS) All data in requests and responses are AES encrypted by the symmetric key. Api automatically decrypted request with symmetric key.
      * Access JWT expires 10 minuts. Sent to client in Authentication Bearer header. JWT is stored in memory in react client. 
      * Refresh JWT expires in 15 days. It is stored in httpOnly cookie and other lfags to ensure the client cannot read its contents. 
      * Silent Refresh: If JWT expires, client will send a request to the `/auth/refresh` with the refresh cookie and a new JWT and refresh token will be made if valid. 
      * **Cors** and **helmet.js** middlewares to provide some basic security to server.
      * The encryption keys needed to make JWT and hash passwords are over 400 characters long and are stored in the **.env** file. The encryption keys are concatenations of several randomly generated hashes. 
      * During registration and login phase, all user inputs are validated using **Joi**.
      * During registration, passwords are hashed and stored in the database. 
      </details>

<br/>

# 📐 USABILITY (CLIENT REQUESTS):
* **Client Headers** Send encrypted authentication code to server through the header
  * To make any requests to the server, the application needs to have the valid access key.
  * Header `auth-token` = encrypt (with AES and the symmetric key) the JWT given by the server during login. This lets you access user routes.
  * Header `Content-Type` = `application/json`
  * (optional if using TLS) Header `handshake` =  
    * nothing - to initiate TLS handshake
    * `0` - to  say sending client's symmetric key to server 
    * `handshake_index` - this is sent by server after successful TLS handshake 
  * (optional if using TLS) AES encrypt the post request body with the symmetric key

  
  


