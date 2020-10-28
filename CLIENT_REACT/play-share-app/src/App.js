import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import LoginRegisterPage from "./JSX/SignInUpPage/LoginRegisterPage";
import GlobalFeed from "./JSX/Feed/GlobalFeed";
import MakePost from "./JSX/MakePostComponents/MakePost.jsx";

import UserFeed from "./JSX/Feed/UserFeed";
import './JSX/app.css'

// export var API_URL_BASE = "http://157.230.184.203:8000"; 

class App extends Component{  
    logged_user = "mhasan1"
    render(){
        return (    
            <Router>                             
                    <Switch>
                        <GlobalFeed path="/globalFeed" exact logged_user={this.logged_user} component={GlobalFeed}/>
                        <MakePost   path="/globalFeed/makePost" exact component={MakePost}/>
                        <UserFeed   path="/userFeed/:username" exact component={UserFeed}/>
                        <LoginRegisterPage path="/" component={LoginRegisterPage}/>
                    </Switch>
            </Router>      
        );
    }
}

// export {API_URL_BASE}
export default App;
