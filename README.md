# Play Share App
* This is a Reddit/Imgur-like app where gamers can share short clips of their game plays. Users can join different game groups just like reddit. App will feature an hierarchical commenting system
* Server: REST API built with Node, Express, MongoDB. Will migrate databse to PostgresQL. Client: Currently being built with React
* Implemented various security features to secure HTTP requests and responses. (Didn't use HTTPS on purpose to have fun implementing security features). This implementation can easily be disabled by disablign the middleware. 
* Hosted a clustered REST API server on DigitalOcean and used NGINX as a reverse Proxy. Enabled HTTPS. 

<br/>

![Login & Register Page Demo](login_register_demo2.gif)

<div style="text-align:center;   font-style: italic;">
    Fig 1:  Login & Registration Demo
</div>

# 📌 TECHNOLOGIES USED:
* The REST API Server is built using **Node**, **Express**, and **Mongoose**
* The Client side is still in production and is being built with **React**
* **helmet.js** - used to give some basic security to REST API application
* **node-rsa** - used to creeate asymmetric RSA keys
* **bcrypt** - used to store hashed passwords and portion of key needed to make JWT into the database
* **crypto-js** - used to encrpt and decrypt username, email, password, and JWT between requests and responses between client and server (this is in a middleware so can easily disable when usign https)
* **JWT** - used to authenticate a user
* **Joi** - used to validate cLient request body

# 📋 APPLICATION OVERVIEW:
* The login and register process is explained in the **APP SECURITY** section.
* To access the user or admin private routes, the client must supply the valid JWT token in the **auth-token** header. JWT expire after one hour. 
* Users can make a posts, edit their own posts, delete a post, see all of their posts, and like other user's posts. User feed is currently in production.
* Admin can see all user's posts, see only a specific user's posts, and delete one or many posts by id. 

# 🏠 RUN SERVER LOCALLY:
1) Rename ***.env.example*** to ***.env***. Can modify all eight variables but must change the **DB_CONNECT** variable so that you can connect to your Mongo Database. Make sure the keys are long and randomly generated. 
    <details>      
      <summary> Description of the variables (Will not need most of this when using https)</summary>
    
      * `DB_CONNECT`  - Store your MongoDB Connection URL
      * `ADMIN_EMAIL` - This is the email address of the admin account.
      * `APP_AUTH_KEY` - (Will be hashed every request) Need this key to give the client permission to talk to the server. This is to stop unauthorized apps to attack the server with new user registrations and ultimately overload the database.
      * `ADMIN_SECRET_KEY` - (Will be hashed every hour) This will be used to make the admin's JWT
      * `USER_SECRET_KEY`  - (Will be hashed every hour) This will be used to make the user's JWT
      * `SERVER_ENCRYPTION_KEY`   - (Will be hashed every hour) This key will help the client decrypt the JWT token that is sent from the server durign login.
      * `CLIENT_ENCRYPTION_KEY`   - (Will be hashed every hour) This key will help the server decrypt the password and the JWT token that is sent from the client during registration and login.
      * `SALT_NUM = 10`    - Can keep this as is. This is the salt number to hash the password and the JWT User Secret Key to store in the database. Can change this number every year to change the hashing algorithm of these fields.
    </details>
2) `npm install` on the ***CLIENT_REACT*** and ***SERVER*** directories
3) `npm start` on the ***CLIENT_REACT*** and ***SERVER*** directories to run the client and server 
<br/>


# 🛡️ APP SECURITY:
  ![Post Request Body](/Pictures/My_TLS_Handshake.png)

  * All data in requests and responses are AES encrypted by the symmetric key.
  * JWT expires every hour.
  * Encryption keys are over 400 characters long and are stored in the **.env** file. The encryption keys are concatenations of several randomly generated hashes. 
  * During registration and login phase, all user inputs are validated using **Joi**.
  * During registration, passwords are hashed and stored in the database. 
  * Admin and user JWT are created differently. 
    * User JWT is created by hashing a unique user string. The unique user string is the user's stored data (objectId, username, name, hashed password, email) AES encrypted by the `USER_ENCRYPTION_KEY`. 
    * Admin JWT uses the same process but uses both the `USER_ENCRYPTION_KEY` and the `ADMIN_ENCRYPTION_KEY`. 
  <details>      
    <summary style="padding-left: 25px;"> IN DEVELOPMENT: </summary>

  * Authetication headers 
  * `ADMIN_SECRET_KEY`, `USER_SECRET_KEY`, `SERVER_ENCRYPTION_KEY`, `CLIENT_ENCRYPTION_KEY` will all be hashed every hour to prevent attackers that have access from making requests. 
  * Add salt so user string to increase the randomness of JWT
  </details>
<br/>

<br/>


# 📐 USABILITY (CLIENT REQUESTS):
* **Client Headers:** Send encrypted authentication code to server through the header
  * To make any requests to the server, the application needs to have the valid access key. 
  * Header **'auth-token'** = encrypt (with AES and the symmetric key) the JWT given by the server during login. This lets you access user routes.
  * Header **'Content-Type'** = `application/json`
  
  <!-- 
* **Registration: Client &#8594; POST Request to REST API Server to Register New User**
  *   Registration Post Request Body: AES encrypt `auth-app` and `auth-token` headers
  *   Registration Post Request Headers: AES encrypt `auth-app` and `auth-token` headers

<div style="width=100; height=100; text-align:center; font-style: italic ">    

  ![Post Request Body](/Pictures/Registration/Registration_Post_Request_Body.PNG )
  
  <p > Fig 2: Registration Post Request Body </p>

  ![Post Request Header ](/Pictures/Registration/Registration_Post_Request_Headers.PNG)
 
  <p > Fig 3: Post Registration BodyHeader </p>

</div>     -->


  


