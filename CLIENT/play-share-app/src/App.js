import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import SignInUpPage from "./JSX/SignInUpPage/SignInUpPage";
import GlobalFeed from "./JSX/Feed/GlobalFeed";
import MakePost from "./JSX/MakePostComponents/MakePost.jsx";
import UserFeed from "./JSX/Feed/UserFeed";
import './JSX/app.css'
// export const API_URL = "http://157.230.184.203:8000"; 
// export var API_URL = "http://localhost:8000"
// export var getROUTE = function(){
//     return API_URL
// }

class App extends Component{  
    logged_user = "mhasan1"
    render(){
        return (    
            <Router>                             
                <Switch>
                    <GlobalFeed path="/globalFeed" exact component={GlobalFeed} logged_user={this.logged_user} /> 
                    <MakePost   path="/globalFeed/makePost" exact component={MakePost} logged_user={this.logged_user}/> 
                    <UserFeed   path="/userFeed/:username" exact component={UserFeed}/>
                    <SignInUpPage path="/" component={SignInUpPage}/>
                </Switch>
            </Router>      
        );
    }
}

export default App;



