import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import SignInUpPage from "./pages/SignInUpPage/SignInUpPage";
import GlobalFeed from "./pages/Feed/GlobalFeed";
import MakePost from "./pages/MakePostComponents/MakePost.jsx";
import UserFeed from "./pages/Feed/UserFeed";
import TestPost from "./pages/Components/Post";
import CONFIG from "./config"
import './App.css'

class App extends React.Component{  
    render(){
        const testPost = [
            {
                content: "test1 content there is no way that i will do this to  me  me me me me m em ",
                date: "2021-01-12",
                dislikes: 0,
                group: "None",
                group_type: "None",
                handle: "@hasan2",
                isURL: false,
                likes: 0,
                title: "test1 title is me",
                total_likes: -100,
                user_disliked: [],
                user_liked: [],
                username: "hasan2",
                _id: "5ffe4e2fac404632f4183c0b",
            },
            {
                content: "test1 content there is no way that i will do this to  me  me me me me m em ",
                date: "2021-01-12",
                dislikes: 0,
                group: "None",
                group_type: "None",
                handle: "@hasan2",
                isURL: false,
                likes: 0,
                title: "test1 title is me",
                total_likes: 100,
                user_disliked: [],
                user_liked: [],
                username: "hasan2",
                _id: "5ffe4e2fac404632f4183c0b",
            },
            {
                content: "https://i.imgur.com/fiAqUmu.jpeg", 
                date: "2021-01-12",
                dislikes: 0,
                group: "None",
                group_type: "None",
                handle: "@hasan2",
                isURL: true,
                likes: 0,
                title: "test1 title is me",
                total_likes: 100,
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
                    <TestPost     exact path="/test" post={testPost[2]} />
                    <Route path="*" component={()=>"404 NOT FOUND!"}/>
                </Switch>
            </Router>      
        );
    }
}

export default App;
