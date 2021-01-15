import React, {Component} from "react"
import Post from "./Post"

class Posts extends React.Component{
    deleteHandler(postId){
        console.log(postId)
    }
    render(){
        return(
            <div class="posts-body">
                {this.props.posts.map((post)=>
                    <Post post={post} deleteHandler={p=>this.deleteHandler(p)}/> 
                )}
            </div>
        )
    }
    
}

export default Posts;
