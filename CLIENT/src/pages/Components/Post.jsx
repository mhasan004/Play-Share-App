import React, {Component} from "react"
// import '../../css/post.css'

class Post extends React.Component{
    loggedUser = localStorage.getItem("username")
    state = this.props.post

    async likeHandler(event) {
        // if (this.state.username === this.loggedUser)                                                                           // cant vote on own post
        //     return
    
        // I hit like again, so remove like
        if (this.state.user_liked.includes(this.loggedUser) && !this.state.user_disliked.includes(this.loggedUser)){          // if already liked, remove it
            this.setState({
                like: this.state.like - 1,
                total_likes: this.state.total_likes - 1,
                user_liked: this.state.user_liked.filter(usrs => usrs !== this.loggedUser),
            })  
            return
        }

        // I disliked it but now switching to like it
        if (this.state.user_disliked.includes(this.loggedUser) && !this.state.user_liked.includes(this.loggedUser) ){         // if I had it in dislike, remove dislike and add like
            let new_user_liked = this.state.user_liked
            new_user_liked.push(this.loggedUser)
            this.setState({
                like: this.state.like + 2,
                dislike: this.state.like - 1,
                user_liked: new_user_liked,
                user_disliked: this.state.user_disliked.filter(usrs => usrs !== this.loggedUser),
                total_likes: this.state.total_likes + 2,            
            })
            return
        }

        if (!this.state.user_disliked.includes(this.loggedUser) && !this.state.user_liked.includes(this.loggedUser)){         // if I hadn't it voted
            let new_user_liked = this.state.user_liked
            new_user_liked.push(this.loggedUser)
            this.setState({
                like: this.state.like + 1,
                user_liked: new_user_liked,
                total_likes: this.state.total_likes + 1,            
            })
            return
        }
    }
    async dislikeHandler(event) {    
        // if (this.state.username === this.loggedUser)                                                                           // cant vote on own post
        //     return
    
        // I hit dislike again, so remove dislike
        if (this.state.user_disliked.includes(this.loggedUser) && !this.state.user_liked.includes(this.loggedUser)){          // if already disliked, remove it
            this.setState({
                dislike: this.state.dislike + 1,
                total_likes: this.state.total_likes + 1,
                user_disliked: this.state.user_disliked.filter(usrs => usrs !== this.loggedUser),
            })  
            return
        }

        // I liked it but now switching to dislike it
        if (this.state.user_liked.includes(this.loggedUser) && !this.state.user_disliked.includes(this.loggedUser) ){         // if I had it in like, removelike and add dislike
            let new_user_disliked = this.state.user_disliked
            new_user_disliked.push(this.loggedUser)
            this.setState({
                dislike: this.state.dislike + 2,
                like: this.state.dislike - 1,
                user_disliked: new_user_disliked,
                user_liked: this.state.user_liked.filter(usrs => usrs !== this.loggedUser),
                total_likes: this.state.total_likes - 2,            
            })
            return
        }

        if (!this.state.user_liked.includes(this.loggedUser) && !this.state.user_disliked.includes(this.loggedUser)){         // if I hadn't it voted
            let new_user_disliked = this.state.user_disliked
            new_user_disliked.push(this.loggedUser)
            this.setState({
                dislike: this.state.dislike + 1,
                user_disliked: new_user_disliked,
                total_likes: this.state.total_likes - 1,            
            })
            return
        }
    }
    editHandler(event) {
        console.log("edit")
    }
    deleteHandler(event) {
        this.props.deleteHandler(this.state.postId)
    }
    commentHandler(event) {
        console.log("begin total: "+this.state.total_likes+"           liked: "+this.state.user_liked+"       disliked: "+this.state.user_disliked+"      user: "+this.loggedUser+"         indisliked?: "+this.state.user_disliked.includes(this.loggedUser))
    }
    likeChangeHandler(event){
        console.log(event.target.value)
    }
    getLikeColor(){
        if (this.state.total_likes > 0) return "#2BB3FF"
        else if (this.state.total_likes < 0)  return "#FF4B2B"
        else if (this.state.total_likes === 0) return "#A5A3A3"
    }
 
    render(){
        let svg_stroke_color     = "#A5A3A3"
        let svg_up_arrow_color   = "#A5A3A3"
        let svg_down_arrow_color = "#A5A3A3"
        let show_actions = false

        if (this.state.group_type === "game")
            svg_stroke_color = "#FF4B2B"
        else
            svg_stroke_color = "white"


    

        if (this.state.user_liked.includes(this.loggedUser)){
            svg_up_arrow_color   = "#2BB3FF"
            svg_down_arrow_color = "#A5A3A3"
        }
        else if (this.state.user_disliked.includes(this.loggedUser)){
            svg_up_arrow_color   = "#A5A3A3"
            svg_down_arrow_color = "#FF4B2B"
        }
            


        if (this.state.username === this.loggedUser){
            show_actions = true
        }

/*fill={svg_stroke_color}/>*/
        return(
            <div class="post-body center">
                <div class="post-rows">
                    <div class="post-top-container"> 
                        <div class="post-top-container-left center-vertically"> 
                                <h1 class="post-top-handle"> {this.state.handle} </h1>
                                <h1 class="post-top-date"> {this.state.date} </h1>
                        </div>   

                        <div class="post-top-container-right center-vertically"> 
                            <svg class="svg-stroke-container center-vertically"  width="383" height="60" viewBox="0 0 383 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.984528" y="0.5" width="382.015" height="59" rx="25" fill={svg_stroke_color}/>
                                <rect x="308" y="0.5" width="75.0388" height="59" fill={svg_stroke_color}/>
                            </svg>

                            <h1 class="post-top-groupName"> {this.state.group} </h1> 

                            


                        </div>  
                    </div>  

                    <div class="post-title-content-container "> 
                        <h1 class="post-title">{this.state.title}</h1>
                        {this.state.isURL ? (
                            <div  class="post-content-img" style={{backgroundImage: `url(${this.state.content})`}}></div>
                        ) : (
                            <h1 class="post-content-text">{this.state.content}</h1>
                        )} 

                    </div> 
                </div>

                <div class="post-actions-constainer  noselect">
                     <svg class="post-actions-left-background" width="193" height="40" viewBox="0 0 193 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="193" height="58" rx="20" fill="#EEEEEE"/>
                        </svg>
                    <span class="post-actions-left">
                        <svg class="post-arrow-up post-arrows" onClick={e=>this.likeHandler(e)} viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 0L44 26L0 26L22 0Z" fill={svg_up_arrow_color}/>
                            <path d="M11.7759 26.0033L32.7759 26.0033V52.0033H11.7759V26.0033Z" fill={svg_up_arrow_color}/>
                        </svg>
                        <div class="post-total-likes-text-div">
                            <a class="post-total-likes-text"  onChange={e=>this.likeChangeHandler(e)} style={{color: this.getLikeColor()}} >{this.state.total_likes}</a>
                        </div>
                        <svg class="post-arrow-down post-arrows" onClick={e=>this.dislikeHandler(e)} viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 52.0033L0 26.0033H44L22 52.0033Z" fill={svg_down_arrow_color}/>
                            <path d="M32.2241 26H11.2241V0H32.2241V26Z" fill={svg_down_arrow_color}/>
                        </svg>
                       

                    </span>

                    <div class="post-comment" onClick={e=>this.commentHandler(e)} >       
                        <svg  width="45" height="40" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.5 0C10.0648 0 0 10.0631 0 22.5C0 26.4465 1.02928 30.301 2.98382 33.7006L0.0848007 42.7032C-0.117416 43.3308 0.0487519 44.0188 0.514984 44.485C0.976753 44.9468 1.66306 45.1191 2.29683 44.9152L11.2994 42.0162C14.699 43.9707 18.5535 45 22.5 45C34.9352 45 45 34.9369 45 22.5C45 10.0648 34.9369 0 22.5 0ZM22.5 41.4844C18.9353 41.4844 15.4605 40.4898 12.4513 38.608C12.0184 38.3375 11.4807 38.2644 10.9805 38.4254L4.48174 40.5183L6.57463 34.0195C6.73325 33.5265 6.6663 32.9882 6.39164 32.5487C4.51023 29.5395 3.51562 26.0647 3.51562 22.5C3.51562 12.0321 12.0321 3.51562 22.5 3.51562C32.9679 3.51562 41.4844 12.0321 41.4844 22.5C41.4844 32.9679 32.9679 41.4844 22.5 41.4844ZM24.6973 22.5C24.6973 23.7133 23.7136 24.6973 22.5 24.6973C21.2864 24.6973 20.3027 23.7133 20.3027 22.5C20.3027 21.2864 21.2864 20.3027 22.5 20.3027C23.7136 20.3027 24.6973 21.2864 24.6973 22.5ZM33.4863 22.5C33.4863 23.7133 32.5027 24.6973 31.2891 24.6973C30.0754 24.6973 29.0918 23.7133 29.0918 22.5C29.0918 21.2864 30.0754 20.3027 31.2891 20.3027C32.5027 20.3027 33.4863 21.2864 33.4863 22.5ZM15.9082 22.5C15.9082 23.7133 14.9246 24.6973 13.7109 24.6973C12.4976 24.6973 11.5137 23.7133 11.5137 22.5C11.5137 21.2864 12.4976 20.3027 13.7109 20.3027C14.9246 20.3027 15.9082 21.2864 15.9082 22.5Z" fill="#BFBFBF"/>
                        </svg>
                    </div>      


                    {show_actions ? (
                        <span class="post-actions-right">
                              <svg class="post-edit" onClick={e=>this.editHandler(e)} width="45" height="40" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5 31.05L0 45L13.95 40.5L4.5 31.05Z" fill="#BFBFBF"/>
                                <path d="M29.6157 5.86141L7.66046 27.8167L17.2063 37.3625L39.1615 15.4072L29.6157 5.86141Z" fill="#BFBFBF"/>
                                <path d="M44.325 6.975L38.025 0.675C37.125 -0.225 35.775 -0.225 34.875 0.675L32.85 2.7L42.3 12.15L44.325 10.125C45.225 9.225 45.225 7.875 44.325 6.975Z" fill="#BFBFBF"/>
                            </svg>
                            <svg class="post-delete" onClick={e=>this.deleteHandler(e)} width="45" height="40" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.6663 2.71637H27.3337V3.98186H30.825V2.53922C30.8254 1.13915 29.362 0 27.5632 0H17.4368C15.638 0 14.1746 1.13915 14.1746 2.53922V3.98186H17.6663V2.71637Z" fill="#BFBFBF"/>
                                <path d="M38.8878 14.7437H6.11213C5.21405 14.7437 4.50707 15.3397 4.57944 16.0363L7.31957 42.3952C7.47227 43.8667 9.04997 45 10.9454 45H34.0541C35.9495 45 37.5272 43.8667 37.6799 42.3949L40.42 16.0363C40.4929 15.3397 39.7859 14.7437 38.8878 14.7437ZM14.0483 42.1885C14.0117 42.1902 13.9751 42.1913 13.9389 42.1913C13.0236 42.1913 12.2553 41.6368 12.1983 40.9165L10.4812 19.2772C10.422 18.5284 11.1542 17.884 12.1162 17.838C13.0752 17.7927 13.9071 18.3609 13.9662 19.11L15.683 40.7493C15.7425 41.4981 15.0104 42.1422 14.0483 42.1885ZM24.2652 40.8331C24.2652 41.5829 23.4837 42.1909 22.5194 42.1909C21.5551 42.1909 20.7735 41.5829 20.7735 40.8331V19.1935C20.7735 18.4433 21.5551 17.8353 22.5194 17.8353C23.4832 17.8353 24.2652 18.4433 24.2652 19.1935V40.8331ZM34.5188 19.2735L32.8793 40.9127C32.825 41.6344 32.0553 42.1909 31.1383 42.1909C31.1039 42.1909 31.069 42.1902 31.0341 42.1889C30.0716 42.1446 29.3373 41.5019 29.3942 40.7531L31.0332 19.1135C31.0897 18.3647 31.9132 17.7934 32.8784 17.8377C33.8409 17.8816 34.5753 18.5247 34.5188 19.2735Z" fill="#BFBFBF"/>
                                <path d="M44.925 10.5524L43.7785 7.87857C43.4762 7.17373 42.628 6.69823 41.6725 6.69823H3.32702C2.37201 6.69823 1.52336 7.17373 1.2215 7.87857L0.0749643 10.5524C-0.146135 11.068 0.141603 11.594 0.678685 11.8563C0.897577 11.9631 1.15663 12.0273 1.44128 12.0273H43.5587C43.8434 12.0273 44.1029 11.9631 44.3213 11.856C44.8584 11.5937 45.1461 11.0677 44.925 10.5524Z" fill="#BFBFBF"/>
                            </svg>
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