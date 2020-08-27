# Social_Media_REST_API

*This REST API will be the server for my social media app which will mimic the functionality of twitter. The Client and Server Sides are still in production*

----------------------
* **The REST API Server is built using Node, Express, and Mongoose. The Client side is still in production and is being built with React** 
* **bcrypt is used to store hashed passwords and user JWT secret keys into the database**
* **crypto-js is used to encrpt and decrypt username, email, password, and JWT between requests and responses between client and server**
* **JWT is used to authenticate a user**
* **Joi is used to validate cLient requests**
----------------------

# 📋 APPLICATION OVERVIEW:
* The login and register process is explained in the **APP SECURITY** section.
* All server routes are protected. To make any requests to the server, the app will need to supply the valid encrypted access key in the **auth-app** header. This is the `APP_AUTH_KEY`. 
* To access the user or admin private routes, the client must supply the valid encrypted JWT token in the **auth-token** header. The JWT is unique for every user. JWT expire after one hour. 
* Users can make a posts, edit their own posts, delete a post, see all of their posts, and like other user's posts. User feed is currently in production.
* Admin can see all user's posts, see only a specific user's posts, and delete one or many posts by id. 
### LOGIN & REGISTRATION DEMO: SILL IN DEVELOPMENT
 * Client side is currently being built with **React**. Here is a demo of the login page writen with Node & Express. I am currently converting it to React:

 ![Login & Register Page Demo](login_register_demo.gif)


 

# 🏠 HOW TO RUN SERVER LOCALLY:
<details>
 <summary> Click here to see steps to run server locally! </summary>
 
 1) Need to make an **.env** file in the root directory and create these eight variables. Can make up your own values for all variables except for **DB_CONNECT**: 
    * `DB_CONNECT`  - Store your MongoDB Connection URL
    * `ADMIN_EMAIL` - This is the email address of the admin account.
    * `APP_AUTH_KEY` - Need this key to give the client permission to talk to the server. This is to stop unauthorized apps to attack the server with new user registrations and ultimately overload the database.
    * `ADMIN_SECRET_KEY` - This will be used to make the admin's JWT
    * `USER_SECRET_KEY`  - This will be used to make the user's JWT
    * `SERVER_ENCRYPTION_KEY`   - This key will help the client decrypt the JWT token that is sent from the server durign login.
    * `CLIENT_ENCRYPTION_KEY`   - This key will help the server decrypt the password and the JWT token that is sent from the client during registration and login.
    * `SALT_NUM = 10`    - Can keep this as is. This is the salt number to hash the password and the JWT User Secret Key to store in the database. Can change this number every year to change the hashing algorithm of these fields.
 2) `npm install` on the *CLIENT* and *SERVER* directories
 3) `npm start` on the *CLIENT* and *SERVER* directories to run the client and server 
</details>

# 🛡️ APP SECURITY:
  * All relevant data are encrypted using AES before being transfered from client to server or server to client.
  * App will need to send the correct encrypted **auth-app** key to interact with the server.
  * During registration and login, all inputs are validated with **Joi**.
  * During registration, passwords and Unique User JWT Secret Keys are hashed and stored in the database.
  * After successful login, the server creates an unique JWT, encrypts it with AES, and send to the client through the **auth-token** header.
  * To access private user routes, client need to send the correct encrypted JWT through the **auth-token** header to the server. 

### 🔑 REGISTRATION SECURITY
 * **CLIENT**
   * The username, email address, and password are encrypted (with AES) using the `CLIENT_ENCRYPTION_KEY` and is sent to the REST API Server over http. 
 * **SERVER**
   * The username, email address, and password are decrypted using the `CLIENT_ENCRYPTION_KEY`. Only the password is hashed using **bcrypt** and all are stored in the database
   * The request is validated using **Joi**

### 🔒 LOGIN SECURITY
 * **CLIENT**
   * The username, email address, and password are encrypted (with AES) with the `CLIENT_ENCRYPTION_KEY` and is sent to the REST API Server over http. 
* **SERVER**
  * The username, email address, and password are decrypted using the `CLIENT_ENCRYPTION_KEY`.
  * User is verified by using **bcrypt** to calculate a hash of the decrypted password and comparing it to the hashed password that is stored in the database. 
  * **Unique JWT Token Creation Process for Users:**
    * *JSON Web Tokens (JWT)* need a secret key to create a JWT token hash. We need a unique JWT secret key for each user to that an user can't access another user's routes.
    * A unique JWT User Secret Key hash is created by encrypting (with AES) the string resulted from concatenating different fields of the user's profile data that is stored in the database (such as the username, email, hashed password,and ObjectID) using the `USER_SECRET_KEY`.
    * This creates a unique key for each user. This ensures that each user has a unique secret key and therefore a unique JWT
    * We need to store this JWT User Secret Key so that we can validate a JWT. The JWT User Secret Key is hashed with *bcrypt* and is then stored in database.
    * The JWT is created using the concatenation of all the user's profile data and the JWT User Secret Key.
    * The JWT token lasts for one hour.
  * **JWT Token Creation Process for Admin:**
    * The JWT is created using the concatenation of all the user's profile data, the JWT User Secret Key, and `ADMIN_SECRET_KEY`
* **Sending Encrypted JWT Tokens**
  * The JWT token is encrypted (with AES) with the `CLIENT_ENCRYPTION_KEY` if sending from client to the server, and the `SERVER_ENCRYPTION_KEY` if sending from server to the client.
  * In the server, the JWT token is encrypted (with AES) using the `SERVER_ENCRYPTION_KEY` and is stored in the 'auth-token' header and is sent to the client. When verifying a user, can decrypt the jwt token that the client sent in the header by decrypting it using the `CLIENT_ENCRYPTION_KEY`. 
  * When the client makes a request to access a private route, it needs to decrypted the token stored in the header using the `SERVER_ENCRYPTION_KEY` and send it to the server by encrypting it using the `CLIENT_ENCRYPTION_KEY`. This way, the token is encrypted (with AES) both ways.

# 📐 USABILITY (CLIENT REQUESTS):
* **Client Headers:** Send encrypted authentication code to server through the header
  * To make any requests to the server, the application needs to have the valid access key. 
  * Header **'auth-app'** = encrypt (with AES) the `APP_AUTH_KEY` with the `CLIENT_ENCRYPTION_KEY`. This lets you access the login and registration routes.
  * Header **'auth-token'** = encrypt (with AES) the token recieved from the server during login with the `CLIENT_ENCRYPTION_KEY`. This lets you access user routes.
  * Header **'Content-Type'** = `application/json`


  
  


