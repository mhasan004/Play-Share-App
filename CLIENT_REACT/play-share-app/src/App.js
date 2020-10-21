import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import LoginRegisterPage from "./JSX/SignInUpPage/LoginRegisterPage";
import Global_Feed from "./JSX/Feed/Global_Feed";
import User_Feed from "./JSX/Feed/User_Feed";


// export var API_URL_BASE = "http://157.230.184.203:8000"; 

class App extends Component{  
    render(){
        return (    
            <Router>                             
                <div id="AppDiv">
                    <Switch>
                        <LoginRegisterPage path="/" exact component={LoginRegisterPage}/>
                        <Global_Feed path="/global_feed" component={Global_Feed}/>
                        <User_Feed   path="/user_feed/:username" component={User_Feed}/>
                    </Switch>
                </div>
            </Router>      
        );
    }
}

// export {API_URL_BASE}
export default App;
