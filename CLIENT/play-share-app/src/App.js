import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import SignInUpPage from "./JSX/SignInUpPage/SignInUpPage";
import GlobalFeed from "./JSX/Feed/GlobalFeed";
import MakePost from "./JSX/MakePostComponents/MakePost.jsx";
import UserFeed from "./JSX/Feed/UserFeed";
import VARIABLES from "./Variables"
import Auth from "./Auth.js"
import './App.css'

class App extends React.Component{  
    state = {
        loggedUser: "",
        accessToken: ""
    }   
    setAppState = (state)=>{                                                                                                        // use function exp or else get: Unhandled Rejection (TypeError): this.setState is not a function                                   
        this.setState(state);
    }

    render(){
        console.log("App Logged username: "+this.state.loggedUser+"        App Auth: "+this.state.accessToken.length)               // use tags or else cant lift up state
        return (            
            <Router>                             
                <Switch>
                    {/* <Auth path={VARIABLES.PATHS.Auth} setAppState={this.setAppState} loggedUser={this.state.loggedUser} accessToken={this.state.accessToken}/>                              */}
                    <SignInUpPage exact path={VARIABLES.PATHS.SignInUpPage} setAppState={this.setAppState} />                             
                    <GlobalFeed   exact path={VARIABLES.PATHS.GlobalFeed} setAppState={this.setAppState}  loggedUser={this.state.loggedUser} accessToken={this.state.accessToken}/> 
                    <MakePost     exact path={VARIABLES.PATHS.MakePost} setAppState={this.setAppState}  loggedUser={this.state.loggedUser} accessToken={this.state.accessToken}/> 
                    <UserFeed     exact path={VARIABLES.PATHS.UserFeed} setAppState={this.setAppState}  loggedUser={this.state.loggedUser} accessToken={this.state.accessToken}/>
                    <Route path="*" component={()=>"404 NOT FOUND!"}/>
                </Switch>
            </Router>      
            
        );
    }
}

export default App;

{/* <Router>                             
    <Switch>
        <MakePost   path="/globalFeed/makePost" exact component={MakePost} this.state.loggedUser={this.this.state.loggedUser}/> 
        <UserFeed   path="/userFeed/:username" exact component={UserFeed}/>
        <SignInUpPage path="/login" exact component={SignInUpPage}/>
        <GlobalFeed path="/" exact component={GlobalFeed} this.state.loggedUser={this.this.state.loggedUser} /> 
        <Route path="*" component={()=>"404 NOT FOUND!"}/>
    </Switch>
</Router>       */}