import React, {Component} from "react"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'            
// import { faArrowUp } from '@fortawesome/free-solid-svg-icons'              // Get icons: https://fontawesome.com/        fa-arrow-up -> faArrowUp
// import { Link } from 'react-router-dom';
import './post.css'

class Post extends React.Component{
    state = {
        username: "John Doe",
        handle: "@johnDoe00942",
        date: "Posted Today",

        title: "This is my game play, we won 30 battles but lost 55 but that is ok because ",
        content: "https://i.imgur.com/fiAqUmu.jpeg",
        isURL: 1,

        like: 0,
        dislike: 0,
        total_likes: 0,

        users: []
    }

    like(event) {
        // if like post is valid: 
            this.setState({
                like: this.state.like + 1,
                total_likes: this.state.total_likes + 1
            })
        console.log("like:        total_likes: "+this.state.total_likes)
    }
    dislike(event) {
        // if dislike post is valid: 
            this.setState({
                dislike: this.state.dislike + 1,
                total_likes: this.state.total_likes - 1
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
      
        return(
            <div class="post-body center">
                <div class="post-rows">
                    <div class="post-top-container"> 
                        <svg class="svg-stroke-container"  width="319" height="69" viewBox="0 0 319 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M94.5241 5.58364C51.6238 10.4037 29.9999 -3 3.49995 26C-6 46 7.5 59 7.5 59C7.5 59 16.9999 67 29.9999 67C88.8501 67 193.072 43.0005 244.464 63.321C285.027 79.3601 306.476 56.3305 306.476 56.3305C314.725 49.7491 329.965 29.9013 306.476 19.6364C244.16 -7.59607 148.126 -0.438726 94.5241 5.58364Z" fill="#FF4B2B"/>
                        </svg>
                        <h1 class="post-top-handle"> {this.state.handle} </h1>
                        <h1 class="post-top-date"> {this.state.date} </h1>
                    </div>  

                    <div class="post-title-content-container"> 
                        <h1 class="post-title">{this.state.title}</h1>
                        {/* <div style={{backgroundImage: `url(${this.state.content})`, width:'250px',height:'250px'}}></div> */}
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
                        <a class="post-total-likes-text">   {this.state.total_likes}  </a>
                        <svg class="post-arrow-down post-arrows" onClick={e=>this.dislike(e)} viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 52.0033L0 26.0033H44L22 52.0033Z" fill="#FF4B2B"/>
                            <path d="M32.2241 26H11.2241V0H32.2241V26Z" fill="#FF4B2B"/>
                        </svg>
                    </span>

                    <a class="post-comment" onClick={e=>this.comment(e)}>  <i class="far fa-comment-dots"></i></a>

                    <span class="post-actions-right">
                        <a class="post-edit" onClick={e=>this.edit(e)}>     <i class="fas fa-pen"></i></a>
                        <a class="post-delete" onClick={e=>this.delete(e)}> <i class="far fa-trash-alt"></i></a>
                    </span> 
                </div>
            </div>
        );
    }
}

export default Post;


{/* <a class="post-arrow-up post-arrows" onClick={e=>this.like(e)}>      <i class="fas fa-arrow-up"></i></a> */}

{/* <a class="post-total-likes-text">   {this.state.total_likes}  </a>
<a class="post-arrow-down post-arrows" onClick={e=>this.dislike(e)}> <i class="fas fa-arrow-down"></i></a> */}