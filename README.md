# Basic_REST_API_JWT_Authentication
*Example Client requests to the REST API Server is shown in Example_Client_Requests.js*
* **This REST API is built using Node, Express, and Mongoose** 
* **bcrypt is used to store the hashed passwords into the database**
* **JWT is used to authenticate a user**
* **Joi is used to validate the POST requests**


**To start the server locally, go to the Server folder:**
1) npm install

2) Need to create a **.env** file and create 4 variables: 
   * `DB_CONNECT` - stores your MongoDB Connection URL
   * `ADMIN_EMAIL` - register/add your admin account to the database and store the email address here. Can generate JWT token and login to the admin account using this email.
   * `ADMIN_SECRET_TOKEN` - make up a string to be used to make the admin's JSON Web Token
   * `USER_SECRET_TOKEN`  - make up a string to be used to make unique users JSON Web Tokens

3) npm start

