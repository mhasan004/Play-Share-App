import React, {Component} from "react"
import Post from "./Post"
import './posts.css'

class Posts extends React.Component{
    render(){
        let posts = [1,2,3]
        return(
            <div class="posts-body">
                {posts.map((i)=><Post user={i} />)}
            </div>
        )
    }
}

export default Posts;
