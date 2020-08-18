# Basic_REST_API_JWT_Authentication
*Example Client requests to the REST API Server is shown in Example_Client_Requests.js*
* **This REST API is built using Node, Express, and Mongoose** 
* **bcrypt is used to store hashed passwords and hashed user JWT secret keys into the database**
* **JWT is used to authenticate a user**
* **Joi is used to validate POST requests**

----------------------

**To start the server locally, go to the Server folder:**
1) npm install

2) Need to create a **.env** file and create 6 variables: 
   * `DB_CONNECT` - Store your MongoDB Connection URL
   * `ADMIN_EMAIL` - Register/add your admin account to the database and store the email address here. Can generate JWT token and login to the admin account using this email.
   * `APP_AUTH_KEY` -   Make up a string. Need this key to give an application permission to talk to the server. This is to stop unauthorized apps to attack the server with new user registrations and ultimately overload the database..
   * `ADMIN_SECRET_KEY` - Make up a string. This will be used to make the admin's JSON Web Token
   * `USER_SECRET_KEY`  - Make up a string. This will be used to make unique users JSON Web Tokens
   * `ENCRYPTION_KEY`     - Make up a string. This key will help the server decrypt the password that was sent via POST request by the client to login and register. 

3) npm start

