import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import SignInUpPage from "./JSX/SignInUpPage/SignInUpPage";
import GlobalFeed from "./JSX/Feed/GlobalFeed";
import MakePost from "./JSX/MakePostComponents/MakePost.jsx";
import UserFeed from "./JSX/Feed/UserFeed";
// import {Auth} from "./Auth"
import './JSX/app.css'
// export const API_URL = "http://157.230.184.203:8000"; 
// export var API_URL = "http://localhost:8000"
// export var getROUTE = function(){
//     return API_URL
// }
function Auth(){
    /* do i have jwt? can i get name? can i refresh? 
    1) see if there is jwt in storage. 
        if so get user from jwt
    2) if no jwt, send request to silent refresh.
        if access denied, link to login paghe
        if granted access, store new jet to storage and get username
    */

    return "mhasan1"
}

class App extends React.Component{  
    logged_user = "will get logged user form SignInUpPage or jwt"

    render(){
        console.log(this.logged_user)
        return (    
            <Router>                             
                <Switch>
                    <MakePost   path="/globalFeed/makePost" exact component={MakePost} logged_user={this.logged_user}/> 
                    <UserFeed   path="/userFeed/:username" exact component={UserFeed}/>
                    <SignInUpPage path="/login" exact component={SignInUpPage}/>
                    <GlobalFeed path="/" exact component={GlobalFeed} logged_user={this.logged_user} /> 
                    <Route path="*" component={()=>"404 NOT FOUND!"}/>
                </Switch>
            </Router>      
            
        );
    }
}

export default App;



