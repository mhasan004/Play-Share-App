# Social_Media_REST_API
*Example Client requests to the REST API Server is shown in Example_Client_Requests.js*

----------------------

* **This REST API is built using Node, Express, and Mongoose** 
* **bcrypt is used to store hashed passwords and hashed user JWT secret keys into the database**
* **JWT is used to authenticate a user**
* **Joi is used to validate POST requests**
* **crypto-js is used to encrpt and decrypt a user's password**

----------------------

## To start the server locally:
1) `npm install`
2) Need to create a **.env** file and create 7 variables: 
   * `DB_CONNECT`  - Store your MongoDB Connection URL
   * `ADMIN_EMAIL` - Register/add your admin account to the database and store the email address here. Can generate JWT token and login to the admin account using this email.
   * `APP_AUTH_KEY` - Make up a value. Need this key to give an application permission to talk to the server. This is to stop unauthorized apps to attack the server with new user registrations and ultimately overload the database..
   * `ADMIN_SECRET_KEY` - Make up a value. This will be used to make the admin's JSON Web Token
   * `USER_SECRET_KEY`  - Make up a value. This will be used to make unique users JSON Web Tokens
   * `ENCRYPTION_KEY`   - Make up a value. This key will help the server decrypt the password that was sent via POST request by the client to login and register. 
   * `SALT_NUM = 10`    - Can keep this as is. This is the salt number to hash the password and user secret token to store in the database. Can chnage this number every year to change future hashed algorithm
3) `npm start`

## Security:
### Registering New User Security
* **Client:** The password is encrypted with the `ENCRYPTION_KEY` and is sent to the REST API Server over http. 
* **Server:** 
  * The encrypted password is decoded using the `ENCRYPTION_KEY` and is then hashed using *bcrypt* and stored in the database
  * The request is validated using *Joi*

### Login Security
* **Client**
  * The password is encrypted with the `ENCRYPTION_KEY` and is sent to the REST API Server over http. 
* **REST API Server**
  * The encrypted password is decoded using the `ENCRYPTION_KEY`.
  * User is verified by using *bcrypt* to calculate a hash and comparing it to the hashed password that is stored in the database. 
  **JWT Token Creation Process for Users**
    * s
















