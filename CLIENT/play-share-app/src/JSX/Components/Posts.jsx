import React, {Component} from "react"
import Post from "./Post"
import './posts.css'

class Posts extends React.Component{
    deleteHandler(postId){
        console.log(postId)
    }
    render(){
        console.log("--------------- post component")
        console.log(this.props.posts)
        return(
            <div class="posts-body">
                {this.props.posts.map((post)=>
                    <Post post={post} loggedUser={this.props.loggedUser} deleteHandler={p=>this.deleteHandler(p)}/> 
                )}
            </div>
        )
    }
    
}

export default Posts;
