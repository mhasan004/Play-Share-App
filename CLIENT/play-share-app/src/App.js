import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import SignInUpPage from "./pages/SignInUpPage/SignInUpPage";
import GlobalFeed from "./pages/Feed/GlobalFeed";
import MakePost from "./pages/MakePostComponents/MakePost.jsx";
import UserFeed from "./pages/Feed/UserFeed";
import VARIABLES from "./utils/config"
import './App.css'

class App extends React.Component{  
    state = {
        accessToken: ""
    }   
    setAppState = (state)=>{                                                                                                        // use function exp or else get: Unhandled Rejection (TypeError): this.setState is not a function                                   
        this.setState(state);
    }
    render(){
        return (            
            <Router>                             
                <Switch>
                    {/* <Auth path={VARIABLES.PATHS.Auth} setAppState={this.setAppState} loggedUser={this.state.loggedUser} accessToken={this.state.accessToken}/>                              */}
                    <SignInUpPage exact path={VARIABLES.PATHS.SignInUpPage} setAppState={this.setAppState} />                             
                    <GlobalFeed   exact path={VARIABLES.PATHS.GlobalFeed} setAppState={this.setAppState} accessToken={this.state.accessToken}/> 
                    <MakePost     exact path={VARIABLES.PATHS.MakePost} setAppState={this.setAppState} accessToken={this.state.accessToken}/> 
                    <UserFeed     exact path={VARIABLES.PATHS.UserFeed} setAppState={this.setAppState} accessToken={this.state.accessToken}/>
                    <Route path="*" component={()=>"404 NOT FOUND!"}/>
                </Switch>
            </Router>      
        );
    }
}

export default App;
// loggedUser={this.state.loggedUser} 