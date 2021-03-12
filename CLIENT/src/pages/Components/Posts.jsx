import React, {Component} from "react"
import Post from "./Post"

import MakeRequest from '../../utils/MakeRequest';                                          // This will be used to make requests to the server and handle silent refresh if needed
import {Logout} from "../../utils/Auth"                                            // isAuth - Check if user is logged in or not
import CONFIG from "../../config"
const ROUTE_URL = CONFIG.API_BASE_URL + "/user/feed/"

class Posts extends React.Component{
    state = {
        posts: []
    }
   
    async componentDidMount() {
        await this.refreshFeed()
    }
    async refreshFeed(){
        let resJson
        const reqObject = {                                                                 // Feed request object
            method: 'GET',
            mode: 'cors',
            credentials: 'include', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username': localStorage.getItem("username"),
            },
        }
        try{
            resJson = await MakeRequest(ROUTE_URL, reqObject, this.props)                   // Making get feed request
        }
        catch(err){
            console.error("Couldnt make request to API! "+err)
            return await Logout(this.props)
        }
        if (!resJson)
            return console.error("Improper Response!")
        if (resJson.status === 1){
            this.setState({                                                                 // *** need to first clear it (reassigning new object) to force react to re-render. Then i can populate with the new data! Without clearing, react doesnt re-render!
                posts: []
            })
            this.setState({
                posts: resJson.posts
            })
        }
            
        else{
            console.error("Improper or no API response! resJson:")
            console.log(resJson)
            return await Logout(this.props)
        }
    }

    render(){
        return(
            <div class="posts-body">
                {this.state.posts.map((post)=>
                    <Post post={post} refreshFeed={p => this.refreshFeed(p)} /> 
                )}
            </div>
        )
    }
    
}

export default Posts;
