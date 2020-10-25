import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import LoginRegisterPage from "./JSX/SignInUpPage/LoginRegisterPage";
import GlobalFeed from "./JSX/Feed/GlobalFeed";
import UserFeed from "./JSX/Feed/UserFeed";
import './JSX/app.css'

// export var API_URL_BASE = "http://157.230.184.203:8000"; 

class App extends Component{  
    render(){
        return (    
            <Router>                             
                    <Switch>
                        <LoginRegisterPage path="/" exact component={LoginRegisterPage}/>
                        <GlobalFeed path="/global_feed" component={GlobalFeed}/>
                        <UserFeed   path="/user_feed/:username" component={UserFeed}/>
                    </Switch>
            </Router>      
        );
    }
}

// export {API_URL_BASE}
export default App;
