import React, {Component} from "react"
import Post from "./Post"
import './posts.css'

class Posts extends React.Component{
    deleteHandler(postId){
        console.log(postId)
    }
    render(){
        return(
            <div class="posts-body">
                {this.props.posts.map((post)=>
                    <Post post={post} logged_user={this.props.logged_user} deleteHandler={p=>this.deleteHandler(p)}/> 
                )}
            </div>
        )
    }
    
}

export default Posts;
