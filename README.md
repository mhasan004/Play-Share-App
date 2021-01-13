# Play Share App
* This is a Reddit/Imgur-like app where gamers can share short clips of their game plays. Users can join different game groups just like reddit. App will feature an hierarchical commenting system
* Server: REST API built with Node, Express, MongoDB. Will migrate database to PostgresSQL. Client: Currently being built with React
* Implemented various security features. Access tokena nd refresh tokens are stored in HttpOnly cookies. User sessions are presisted suing silent refreshes. Rate limmiting blocks an IP for serveral minutes if they make too many requests. 
* Hosted a clustered REST API server on DigitalOcean and used NGINX as a reverse Proxy. Enabled HTTPS. https://playshare.cloud/ (currently disabled) 

<br/>

![App demo (unfinished)](/PicturesGifs/App_demo_unfinished.gif)

<div style="text-align:center;   font-style: italic;">
    Fig 1: App demo so far (App still in development!)

</div>

# 📌 TECHNOLOGIES / DEPENDENCIES (REST API):
* The REST API Server is built using **Node**, **Express**, and **Mongoose**
* The Client side is still in production and is being built with **React**
* **Redis (async-redis)** - used to cache requests, decrease response times. 
* **helmet.js** - used to give some basic security to REST API application.
* **express-rate-limit** - used to limit how many requests can be made to the server in a specified time by the same IP
* **JWT** - used to authenticate a user - used to make user access and refresh tokens.
* **Joi** - used to validate request body.
* **cookie-parser** - used to parse refresh token signed cookie data from request.
* **node-rsa** - used to create asymmetric RSA keys to initiate TLS handshake between client and server. 
* **bcrypt** - used to store hashed passwords into the database.
* **crypto-js** - (not used if using HTTPS and disabling TLS) used to encrypt response and decrypt request using the client's symmetric key (AES).
* **morgan** - used to log endpoint resonse times to optimize code. 

# 📋 APPLICATION OVERVIEW:
  ![Silent Refresh](/PicturesGifs/Basic_Response.PNG)
    <div style="text-align:center;   font-style: italic;">
      <center> Fig 2: Silent Refresh Process to persist user session. Server will refresh access and refresh tokens if client pass all requirements. <center>
    </div>
* (In Progress) Users can upload image/video to Amazon S3 bucket. Users can delete their own post, can upvote/downvote other psots, comment on other user's posts.  
* The login and registration and session persistance processes are explained in detail in the **APP SECURITY** section.
* Rate limiter: If requests exceed a certain number within a period of time, the IP is blocked. 
* Multiple checks to authenticate user: validating acces and refresh token. Mataching token payloads with username header. Checking if refresh token is in database (only for admin and refresh token routes)
* To access the user or admin private routes, the client must have the valid HttpOnly access token cookie or the valid HttpOnly refresh token cookie.
* Access token expires every 5 minutes. Refresh token JWT expires in 15 days. Username heade4r must also be supplied. With valid username and refresh token, tokens can be refreshed.  
* Users can make a posts, edit their own posts, delete a post, see all of their posts, and like other user's posts. User feed is currently in production. Uploading video and images to S3 bucket in development. 
* Admin can see all user's posts, see only a specific user's posts, and delete one or many posts by id. 

# 🏠 RUN SERVER LOCALLY:
1) Rename ***.env.example*** to ***.env***. Can modify all eight variables but must change the **DB_CONNECT** variable so that you can connect to your Mongo Database. Make sure the keys are long and randomly generated. 
    <details>      
      <summary> Description of the variables</summary>
    
      * `DB_CONNECT`  - Store your MongoDB Connection
      * `ADMIN_USERNAME` - Email address of the admin account.
      * `ADMIN_SECRET_KEY` - This will be used to make the admin's access JWT
      * `USER_SECRET_KEY`  - This will be used to make the admin's and user's access JWT
      * `REFRESH_TOKEN_SECRET` - This is used to generate a refresh JWT refresh
      * `COOKIE_SECRET` - This is used to sign HttpOnly cookies
      * `SALT_NUM = 10` - Can keep this as is. This is the salt number to hash the password and the JWT User Secret Key to store in the database. Can change this number every year to change 
      the hashing algorithm of these fields.
      * `USE_TLS = false` - Can keep this as is. Do you want to use the TLS handshake? false = diable TLS (do this when using https). true = enable TLS. 
    </details>
2) `redis-server` - download redis and start the redis server for REST API.
3) `npm install` on the **CLIENT** & **SERVER** directories
4) `npm start` on the **CLIENT/play-share-app** & **SERVER** directories to run the client and server 
<br/>

# 🛡️ APP SECURITY:

## A) Authentication via JWT Access & Refresh Tokens + Silent Refresh to Persist Sessions:
  ![Silent Refresh](/PicturesGifs/Silent_Refresh.png)
    <div style="text-align:center;   font-style: italic;">
      <center> Fig 2: Silent Refresh Process to persist user session. Server will refresh access and refresh tokens if client pass all requirements. <center>
    </div>

  * After successful login, access token and refresh tokens are made and stored in a HttpOnly cookie. valid refresh tokens and username header lets the application silently refresh tokens.
  * **Admin and User's JWTs :**
    * Access token is signed with the `USER_SECRET_KEY` key or the `ADMIN_SECRET_KEY` key depending on if the user is admin or not. 
    * The payload of the access token is the user's username along with a randomly generated number. 
    * 10 minute expire time for the token and 1 day expire time for the cookie.
  * **Refresh Tokens & Silent Refresh Procedure**: 
    * Refresh token is signed with the `REFRESH_TOKEN_SECRET` key. The token will be stored in a httpOnly cookie and will be signed by `COOKIE_SECRET`.
    * The payload of the refresh token is user's username along with the same random number used in the access token. This random number helps to store the refresh tokens in a key-value database for the purpose of silent refresh. It helps to retrieve the specific refresh token in O(1) instead of querying for the user's specific token.
    * 15 day expire time for the token and cookie.
  * **Access and Refresh Tokens stored in HttpOnly cookies**
    * Both tokens are stored in HttpOnly cookie with `httpOnly=true`, `secure=true`, and expiration flags set so that they cannot be accessed in the client via javascript. 
    * If token expires, client will send a request to the `/auth/refresh` endpoint. The refresh token stored in the httpOnly cookie will also be sent along with the request.
      * If the token is valid and exists in the database, a new refresh token will be created and will replace the old refresh token in the database.
      * A new access token is also created and is sent to the client. 
  
 * <details>      
      <summary> SUMMARY </summary>

      * Application can keep users logged in if the client supplies the correct refresh token HttpOnly cookie and the correct username in header. 
      * (optional if using TLS) All data in requests and responses are AES encrypted by the symmetric key. Api automatically decrypted request with symmetric key.
      * Access token expires 5 minutes and cookie expires in 1 day. 
      * Refresh token and cookie expires in 15 days. 
      * token coockies are HttpOnly cookies with flags set to `httpOnly=true`, `secure=true` to ensure the client cannot read its contents. 
      * Silent Refresh: If access token expires or doesn't exist, client will send a request to the `/auth/refresh` with the refresh token cookie and a new access token and refresh token will be created. 
      * **Cors** and **helmet.js** middlewares to provide some basic security to server.
      * **express-rate-limit** is used to guard against simple DDOS attacks by rating how many requests can be made in a specific time by the same IP.
      * The secret keys needed to make tokens, cookies, and hash passwords are 700-1200 characters long and are stored in the **.env** file. The keys are created using concatenations of several randomly generated hashes. 
      * During registration and login phase, all user inputs are validated using **Joi**.
      * During registration, passwords are hashed and stored in the database. 
      </details>

## B) TLS handshake (optional, disabled by default since using https):
  ![TLS Handshake](/PicturesGifs/TLS_Handshake2.png)
  <div style="text-align:center;   font-style: italic;">
    <center> Fig 3:  TLS Handshake I implemented on the server. Client in development. <center>
  </div>

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

# 📐 USABILITY (CLIENT REQUESTS):
* **Client Headers** Send encrypted authentication code to server through the header
  * To make any requests to the server, the application needs to have the valid access key.
  * `Content-Type` = `application/json`
  * `username` = username. this username will be compared to the username in the tokens to authenticate user
  * `post-id` = client will specify the post id here to edit the specific post
  * `like-dislike` = `dislike` or `like`
  * (optional if using TLS) `handshake` =  
    * nothing - to initiate TLS handshake
    * `0` - to  say sending client's symmetric key to server 
    * `handshake_index` - this is sent by server after successful TLS handshake 
  * (optional if using TLS) AES encrypt the post request body with the symmetric key

  
  


