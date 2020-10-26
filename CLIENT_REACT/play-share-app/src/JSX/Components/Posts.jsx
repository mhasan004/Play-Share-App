import React, {Component} from "react"
import Post from "./Post"
import './posts.css'

class Posts extends React.Component{
    render(){
        /*
            users cant like own post
            mhasan1 cant like any posts. one his, two he already liked
            mhasan2 can like 1. two his, 
            mhasan3 can like any cus he never posted
        */
        let logged_user = "mhasan1"
        let posts = [
            {postID: 1, username: "mhasan1", handle: "@mhasan1", title: "This is my game play 1, we won 30 battles but lost 55 but that is ok because", content: "https://i.imgur.com/fiAqUmu.jpeg", group:"Doom",group_type:"game", date:"Posted Dec 20, 2020", likes:0, dislikes:0, total_likes: 0, user_liked: ["mhasan1", "mhasan2"], user_disliked: [], isURL:1},
            {postID: 2, username: "mhasan2", handle: "@mhasan2", title: "This is my game play 2, we won 30 battles but lost 55 but that is ok because", content: "https://i.imgur.com/fiAqUmu.jpeg", group:"Doom",group_type:"game", date:"Posted Dec 20, 2020", likes:0, dislikes:1, total_likes: -1,  user_liked: ["mhasan1"], user_disliked: [], isURL:1 },
            {postID: 3, username: "mhasan2", handle: "@mhasan2", title: "This is my game play 2, we won 30 battles but lost 55 but that is ok because", content: "https://i.imgur.com/fiAqUmu.jpeg", group:"Doom",group_type:"game", date:"Posted Dec 20, 2020", likes:0, dislikes:0, total_likes: 0,  user_liked: ["mhasan1"], user_disliked: [], isURL:1 },
        ]
    
        
        return(
            <div class="posts-body">
                {posts.map((post)=><Post post={post} logged_user={logged_user} /> )}
            </div>
        )
    }
}

export default Posts;
