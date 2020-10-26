import React, {Component} from "react"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'            
// import { faArrowUp } from '@fortawesome/free-solid-svg-icons'              // Get icons: https://fontawesome.com/        fa-arrow-up -> faArrowUp
// import { Link } from 'react-router-dom';
import './post.css'

class Post extends React.Component{
    state = {
        username: this.props.post.username,
        handle: this.props.post.handle,
        date: this.props.post.date,

        title: this.props.post.title,
        content: this.props.post.content,
        group: this.props.post.group,
        group_type: this.props.post.group_type,
        isURL: this.props.post.isURL,

        like: this.props.post.likes,
        dislike: this.props.post.dislikes,
        total_likes: this.props.post.total_likes,

        user_liked:  this.props.post.user_liked,
        user_disliked:  this.props.post.user_disliked,
    }

    like(event) {
        // if (this.state.user_liked.includes(this.props.logged_user)){            // if already liked, remove it
        //     this.setState({
        //         like: this.state.like - 1,
        //         total_likes: this.state.total_likes - 1,
        //         user_liked: this.state.user_liked.filter(usrs => usrs !== this.props.logged_user),
        //     })
        //     return
        // }

        // if like post is valid: 
            this.setState({
                like: this.state.like + 1,
                total_likes: this.state.total_likes + 1,
                user_disliked: this.state.user_disliked.filter(usrs => usrs !== this.props.logged_user),
                user_liked: this.state.user_liked.push(this.props.logged_user)
            })
        
        console.log("like:        total_likes: "+this.state.total_likes)
    }
    dislike(event) {    
        // if (this.state.user_disliked.includes(this.props.logged_user)){   // if already liked, remove it
        //     this.setState({
        //         dislike: this.state.dislike - 1,
        //         total_likes: this.state.total_likes + 1,
        //         user_disliked: this.state.user_disliked.filter(usrs => usrs !== this.props.logged_user),
        //     })
        //     return
        // }
        // if dislike post is valid: 
            this.setState({
                dislike: this.state.dislike + 1,
                total_likes: this.state.total_likes - 1,
                user_liked: this.state.user_liked.filter(usrs => usrs !== this.props.logged_user),
                user_disliked: this.state.user_disliked.push(this.props.logged_user)
            })
        console.log("dislike:      total_likes: "+this.state.total_likes)
    }
    edit(event) {
        console.log("edit")
    }
    delete(event) {
        console.log("delete")
    }
    comment(event) {
        console.log("comment")
    }
    render(){
        let svg_color = "white"
        let total_likes_color = "#7C7777"
        let show_actions = false

        if (this.state.group_type === "game")
            svg_color = "#FF4B2B"
        else
            svg_color = "#2BB3FF"

        if (this.state.total_likes > 0)
            total_likes_color = "#2BB3FF"
        else if (this.state.total_likes < 0)
            total_likes_color = "#FF4B2B"
        else
            total_likes_color = "#7C7777"



        if (this.state.username === this.props.logged_user){
            show_actions = true
        }


        return(
            <div class="post-body center">
                <div class="post-rows">
                    <div class="post-top-container"> 
                        <div class="post-top-container-left center-vertically"> 
                                <h1 class="post-top-handle"> {this.state.handle} </h1>
                                <h1 class="post-top-date"> {this.state.date} </h1>
                        </div>   

                        <div class="post-top-container-right center-vertically"> 
                             <svg class="svg-stroke-container center-vertically"  width="280" height="59" viewBox="0 0 280 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="280" height="59" rx="25" fill={svg_color}/>
                                <rect x="225" width="55" height="59" fill={svg_color}/>
                            </svg>
                            <h1 class="post-top-groupName"> {this.state.group} </h1> 
                        </div>  
                    </div>  

                    <div class="post-title-content-container"> 
                        <h1 class="post-title">{this.state.title}</h1>
                        {this.state.isURL ? (
                            <div  class="post-content-img" style={{backgroundImage: `url(${this.state.content})`}}></div>
                        ) : (
                            <h1 class="post-content-text">{this.state.content}</h1>
                        )} 

                    </div> 
                </div>

                <div class="post-actions-constainer ">
                    <span class="post-actions-left">
                        <svg class="post-arrow-up post-arrows" onClick={e=>this.like(e)} viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 0L44 26L0 26L22 0Z" fill="#2BB3FF"/>
                            <path d="M11.7759 26.0033L32.7759 26.0033V52.0033H11.7759V26.0033Z" fill="#2BB3FF"/>
                        </svg>
                        <div class="post-total-likes-text-div">
                            <a class="post-total-likes-text"  style={{color: {total_likes_color}}}>{this.state.total_likes}</a>
                           
                            
                        </div>
                        <svg class="post-arrow-down post-arrows" onClick={e=>this.dislike(e)} viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 52.0033L0 26.0033H44L22 52.0033Z" fill="#FF4B2B"/>
                            <path d="M32.2241 26H11.2241V0H32.2241V26Z" fill="#FF4B2B"/>
                        </svg>
                       
                    </span>


                    <a class="post-comment" onClick={e=>this.comment(e)}>  <i class="far fa-comment-dots"></i></a>
                    {show_actions ? (
                        <span class="post-actions-right">
                            <a class="post-edit" onClick={e=>this.edit(e)}>     <i class="fas fa-pen"></i></a>
                            <a class="post-delete" onClick={e=>this.delete(e)}> <i class="far fa-trash-alt"></i></a>
                        </span> 
                    ) : ( console.log())} 
                </div>
            </div>
        );
    }
}

export default Post;


{/* <a class="post-arrow-up post-arrows" onClick={e=>this.like(e)}>      <i class="fas fa-arrow-up"></i></a> */}

{/* <a class="post-total-likes-text">   {this.state.total_likes}  </a>
<a class="post-arrow-down post-arrows" onClick={e=>this.dislike(e)}> <i class="fas fa-arrow-down"></i></a> */}