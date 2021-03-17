import React from "react"
import { useState } from 'react'
import { withRouter } from 'react-router-dom'  
import { isAuth, Logout} from "../../utils/Auth"                                            // isAuth - Check if user is logged in or not
import Popup from "../Components/Popup"
import Posts from "../Components/Posts"
import MakePost from "../MakePost/MakePost"
import MakePostIcon from "../MakePost/MakePostIcon"
import '../../css/globalFeed.css'

class GlobalFeed extends React.Component{
    state={
        posts : [],
        buttonPopup: false,                                                                  // popup state
    }
    async componentDidMount() {
        if (!await isAuth(this.props))                                                      // Check if user is logged in, can refresh tokens here:
            return
    }
    setButtonPopup(bool){
        this.setState({ buttonPopup: bool })
    }    
    newPostAdded(post){
        const newPostsArry = [post].concat(this.state.posts)                                  // appending new post object in front of state array                          
        this.setState({ posts: [] })                                                        // a bit dirty but i need to add the newly made post to the FRONT of the posts state but to force react to render, i set the state to [] to force react to rewnder 
        this.setState({ posts: newPostsArry })
    }

    render(){   
        return (
            <div class="global-feed-body">
                <span class="global-feed-nav">
                    <h1> Hello {localStorage.getItem("username")}</h1>
                    <a onClick={e=> Logout(this.props)}> Logout </a>
                </span>

                <div class="global-feed-posts">
                    <Posts history={this.props.history} setState={s => this.setState(s)} posts={this.state.posts}/>
                </div>
                <div class="global-feed-MakePostIcon">
                    <MakePostIcon setTrigger = {(bool)=>this.setButtonPopup(bool)}/>
                </div>
                <Popup trigger={this.state.buttonPopup} setTrigger={(bool)=>this.setButtonPopup(bool)}>                                                              
                    <MakePost setTrigger={(bool)=>this.setButtonPopup(bool)} newPostAdded={post => this.newPostAdded(post)}/>
                </Popup>
            </div>
        );
    }
}

export default withRouter(GlobalFeed);                  // need to export this class withRouter for redirect to work
