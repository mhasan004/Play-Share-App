import React from "react";
import Posts from "../Components/Posts";
import MakePostIcon from "../MakePostComponents/MakePostIcon"
import './globalFeed.css'
// import Post from "../Components/Post";
import { withRouter } from 'react-router-dom';                      

import MakeRequest from '../../MakeRequest';                                  // This will be used to make requests to the server and handle silent refresh if needed
import VARIABLES from "../../Variables"
const ROUTE_URL = VARIABLES.API_BASE_URL + "user/feed/"


class GlobalFeed extends React.Component{
   
    /*
        users cant like own post
        mhasan1 cant like any posts. one his, two he already liked
        mhasan2 can like 1. two his, 
        mhasan3 can like any cus he never posted
    */
    state = {
        posts: []
    }

    async componentDidMount() {
        let resJson
        const reqObject = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username': this.props.loggedUser,
                'auth-token': this.props.accessToken,
            },
        }

        try{
            const requestObj =  await MakeRequest(ROUTE_URL, reqObject, this.props.setAppState)
            resJson = requestObj.resJson            
        }
        catch(err){
            return console.log(err)
        }

        if (!resJson)
            return console.log("Improper Response!")
        if (resJson.status === 1){
            this.setState({
                posts: resJson.posts
            })
            console.log('Got Feed Posts!')
        }
        else if (resJson.status === -1)
            return alert("Failed to get Feed! " + resJson.message )
        else if (resJson.status === -3){
            this.props.history.push({                                              
                pathname: VARIABLES.PATHS.SignInUpPage,
            });
        }
    }

    render(){
        if (this.props.accessToken.length < 1){
            this.props.history.push({                                  
                pathname: VARIABLES.PATHS.SignInUpPage,
            });
        }                           

        return (
            <div class="global-feed-body">
                <span class="global-feed-nav">
                    <h1> Hello {this.props.loggedUser}</h1>
                    <a> Logout</a>
                </span>

                <div class="global-feed-posts">
                    <Posts posts={this.state.posts} logged_user={this.props.loggedUser} />
                </div>
                <div class="global-feed-MakePostIcon">
                    <MakePostIcon history={this.props.history}  />
                </div>

            </div>

        );
    }
    
}

// export default GlobalFeed;
export default withRouter(GlobalFeed);                  // 3) need to export this class withRouter for redirect to work
