import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import SignInUpPage from "./pages/SignInUpPage/SignInUpPage";
import GlobalFeed from "./pages/Feed/GlobalFeed";
import MakePost from "./pages/MakePostComponents/MakePost.jsx";
import UserFeed from "./pages/Feed/UserFeed";
import TestPost from "./pages/Components/TestPost";
import CONFIG from "./config"
import './App.css'

class App extends React.Component{  
    render(){
        const testPost = [
            {
                content: "test1",
                date: "2021-01-12T05:00:00.000Z",
                dislikes: 0,
                group: "None",
                group_type: "None",
                handle: "@hasan2",
                isURL: false,
                likes: 0,
                title: "test1",
                total_likes: 0,
                user_disliked: [],
                user_liked: [],
                username: "hasan2",
                _id: "5ffe4e2fac404632f4183c0b",
            }
        ]
        return (            
            <Router>                             
                <Switch>
                    <SignInUpPage exact path={CONFIG.PATHS.SignInUpPage} />                             
                    <GlobalFeed   exact path={CONFIG.PATHS.GlobalFeed} /> 
                    <MakePost     exact path={CONFIG.PATHS.MakePost} /> 
                    <UserFeed     exact path={CONFIG.PATHS.UserFeed} />                    
                    <TestPost     exact path="/test" post={testPost[0]} />
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