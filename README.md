# Basic_REST_API_JWT_Authentication
**This REST API is built using Node, Express, and Mongoose** 

*Example Client requests to the REST API Server is shown in Example_Client_Requests.js*

**To start the server locally, go to the Server folder:**
1) npm install

2) Need to create a **.env** file and create 5 variables: 
   * `DB_CONNECT` - stores your MongoDB Connection URL
   * `ADMIN_EMAIL` - register an admin account. This value will be set to the admin email address. 
   * `ADMIN_DB_ID` - after adding the admin accoutn to the DB, store the admin document's MongoDB *_id*
   * `ADMIN_SECRET_TOKEN` - make up a string to be used to make the admin's JSON Web Token
   * `USER_SECRET_TOKEN` - make up a string to be used to make the users's JSON Web Token

3) npm start

