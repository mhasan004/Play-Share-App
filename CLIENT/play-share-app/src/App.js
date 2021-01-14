import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import SignInUpPage from "./pages/SignInUpPage/SignInUpPage";
import GlobalFeed from "./pages/Feed/GlobalFeed";
import MakePost from "./pages/MakePostComponents/MakePost.jsx";
import UserFeed from "./pages/Feed/UserFeed";
// import TestPost from "./pages/Components/TestPost";
import CONFIG from "./config"
import './App.css'

class App extends React.Component{  
    render(){
        // const testPost = {
        //     id:"ds"
        // }
        return (            
            <Router>                             
                <Switch>
                    <SignInUpPage exact path={CONFIG.PATHS.SignInUpPage} />                             
                    <GlobalFeed   exact path={CONFIG.PATHS.GlobalFeed} /> 
                    <MakePost     exact path={CONFIG.PATHS.MakePost} /> 
                    <UserFeed     exact path={CONFIG.PATHS.UserFeed} />                    
                    {/* <TestPost     exact path="/test" post={testPost} /> */}
                    <Route path="*" component={()=>"404 NOT FOUND!"}/>
                </Switch>
            </Router>      
        );
    }
}

export default App;
// access-token-exp 
// (new Date().getTime() >= localStorage.getItem("access-token-exp"))
// localStorage.setItem("access-token-exp", refresh.accessTokenExp)
// localStorage.removeItem("access-token-exp")