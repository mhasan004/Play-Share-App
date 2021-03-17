import React, {Component} from "react"
import MakeRequest from '../../utils/MakeRequest';                                                                                  // This will be used to make requests to the server and handle silent refresh if needed
import CONFIG from "../../config"
import ReactDOM from "react-dom";
import '../../css/post.css'
const ROUTE_URL = CONFIG.API_BASE_URL + "/user"

class Post extends React.Component{
    loggedUser = localStorage.getItem("username")
    state = this.props.post

    async likeHandler(event) {
        // LIKE -> UNLIKE: I hit like again, so remove like
        if (this.state.user_liked.includes(this.loggedUser) && !this.state.user_disliked.includes(this.loggedUser)){                // if already liked, remove it
            this.setState({
                like: this.state.like - 1,
                total_likes: this.state.total_likes - 1,
                user_liked: this.state.user_liked.filter(user => user !== this.loggedUser),
            })  
        }
        // DISLIKE -> LIKE: I disliked it but now switching to like it
        else if (this.state.user_disliked.includes(this.loggedUser) && !this.state.user_liked.includes(this.loggedUser) ){         // if I had it in dislike, remove dislike and add like
            let new_user_liked = this.state.user_liked
            new_user_liked.push(this.loggedUser)
            this.setState({
                like: this.state.like + 2,
                dislike: this.state.like - 1,
                user_liked: new_user_liked,
                user_disliked: this.state.user_disliked.filter(user => user !== this.loggedUser),
                total_likes: this.state.total_likes + 2,            
            })
        }
        // NONE -> LIKE: 
        else if (!this.state.user_disliked.includes(this.loggedUser) && !this.state.user_liked.includes(this.loggedUser)){         // if I hadn't voted and i liked
            let new_user_liked = this.state.user_liked
            new_user_liked.push(this.loggedUser)
            this.setState({
                like: this.state.like + 1,
                user_liked: new_user_liked,
                total_likes: this.state.total_likes + 1,            
            })
        }

        let resJson
        const reqObject = {                                                                 // Feed request object
            method: 'PATCH',
            mode: 'cors',
            credentials: 'include', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'post-id': this.state._id,
                'username': this.loggedUser
            }
        }
        try{
            resJson = await MakeRequest(ROUTE_URL+"/feed/like", reqObject, this.props)                   // Making get feed request
            if (!resJson.status)
                throw "resJson is "+resJson
        } catch(err){
            return console.error("REACT LikeHandler - Couldnt make request to API! Error: "+err)
        }
        if (resJson.status !== 1)
            console.error("REACT LikeHandler - Unsucessful liking post")
    }
    async dislikeHandler(event) {    
        // DISLIKE -> UN-DISLIKE: I hit dislike again, so remove dislike
        if (this.state.user_disliked.includes(this.loggedUser) && !this.state.user_liked.includes(this.loggedUser)){                // if already disliked, remove it
            this.setState({
                dislike: this.state.dislike + 1,
                total_likes: this.state.total_likes + 1,
                user_disliked: this.state.user_disliked.filter(usrs => usrs !== this.loggedUser),
            })  
        }
        // LIKE -> DISLIKE: I liked it but now switching to dislike it
        else if (this.state.user_liked.includes(this.loggedUser) && !this.state.user_disliked.includes(this.loggedUser) ){         // if I had it in like, removelike and add dislike
            let new_user_disliked = this.state.user_disliked
            new_user_disliked.push(this.loggedUser)
            this.setState({
                dislike: this.state.dislike + 2,
                like: this.state.dislike - 1,
                user_disliked: new_user_disliked,
                user_liked: this.state.user_liked.filter(usrs => usrs !== this.loggedUser),
                total_likes: this.state.total_likes - 2,            
            })
        }
        // NONE -> DISLIKE:
        else if (!this.state.user_liked.includes(this.loggedUser) && !this.state.user_disliked.includes(this.loggedUser)){         // if I hadn't voted and disliked
            let new_user_disliked = this.state.user_disliked
            new_user_disliked.push(this.loggedUser)
            this.setState({
                dislike: this.state.dislike + 1,
                user_disliked: new_user_disliked,
                total_likes: this.state.total_likes - 1,            
            })
        }

        let resJson
        const reqObject = {                                                                 // Feed request object
            method: 'PATCH',
            mode: 'cors',
            credentials: 'include', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'post-id': this.state._id,
                'username': this.loggedUser
            }
        }
        try{
            resJson = await MakeRequest(ROUTE_URL+"/feed/dislike", reqObject, this.props)                   // Making get feed request
            if (!resJson.status)
                throw "resJson is "+resJson
        } catch(err){
            return console.error("REACT DeleteHandler - Couldnt make request to API! Error: "+err)
        }
        if (resJson.status !== 1)
            console.error("REACT DeleteHandler - Unsucessful deleting post")      
    }
    async deleteHandler(event) {
        let resJson
        const reqObject = {                                                                 // Feed request object
            method: 'DELETE',
            mode: 'cors',
            credentials: 'include', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'post-id': this.state._id,
            }
        }
        try{
            resJson = await MakeRequest(ROUTE_URL+"/post", reqObject, this.props)                   // Making get feed request
            if (!resJson.status)
                throw "resJson is "+resJson
        } catch(err){
            return console.error("REACT DislikeHandler - Couldnt make request to API! Error: "+err)
        }
        if (resJson.status !== 1)
            console.error("REACT DislikeHandler - Unsucessful disliking post")
        else
            this.props.refreshFeed()
    }
    editHandler(event) {
        console.log("edit")
        // this.props.post.title+"1"
        this.setState(prevState => {
            let post =  { ...prevState };                           // 1) copying post {} state 
            post.title = post.title+'1';                            // 2) update the title property, assign a new value    
            return post ;                                           // 3) return new object jasper object
        })
        console.log(this.state)
        const elem = ReactDOM.findDOMNode(this);                    // ***DEPREDIACTED*** get the post elem so that we can chnage the field
        console.log(elem)
        elem.classList.add("edit-mode")     
    }

    commentHandler(event) {
        console.log("begin total: "+this.state.total_likes+"           liked: "+this.state.user_liked+"       disliked: "+this.state.user_disliked+"      user: "+this.loggedUser+"         indisliked?: "+this.state.user_disliked.includes(this.loggedUser))
        
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

        return(
            <div class="post-card-body-main center">
                <div class="post-card-body">
                    <div class="post-card-left">
                        <div class="PCL-row PCL-row-1">               
                            <svg class="PCL-avatar" viewBox="0 0 71 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="35.4092" cy="35" r="35" fill="#F4F4F4"/>
                                <path d="M35.4127 13.5277C27.7756 13.5277 21.5325 19.7105 21.5325 27.2741C21.5325 34.8377 27.7756 41.0205 35.4127 41.0205C43.0499 41.0205 49.2929 34.8377 49.2929 27.2741C49.2929 19.7105 43.0499 13.5277 35.4127 13.5277Z" fill="#C1C1C1"/>
                                <path d="M59.2332 52.0056C58.8695 51.1052 58.3847 50.2648 57.8392 49.4844C55.051 45.4025 50.7476 42.7012 45.8987 42.0409C45.2926 41.981 44.6258 42.1009 44.1409 42.4611C41.5952 44.322 38.5646 45.2824 35.4127 45.2824C32.2608 45.2824 29.2303 44.322 26.6845 42.4611C26.1996 42.1009 25.5328 41.9209 24.9268 42.0409C20.0778 42.7012 15.7138 45.4025 12.9862 49.4844C12.4407 50.2648 11.9558 51.1652 11.5922 52.0056C11.4104 52.3658 11.471 52.786 11.6528 53.1462C12.1377 53.9865 12.7438 54.827 13.2893 55.5473C14.1378 56.6879 15.047 57.7083 16.0775 58.6687C16.926 59.5091 17.8958 60.2894 18.8657 61.0698C23.654 64.6115 29.4122 66.4723 35.3522 66.4723C41.2921 66.4723 47.0503 64.6114 51.8386 61.0698C52.8084 60.3495 53.7782 59.5091 54.6268 58.6687C55.5966 57.7083 56.5664 56.6878 57.415 55.5473C58.0211 54.7669 58.5667 53.9865 59.0516 53.1462C59.3545 52.786 59.415 52.3657 59.2332 52.0056Z" fill="#C1C1C1"/>
                            </svg>
                            <div class="PCL-handle-date">              
                                <h1 class="PCL-handle"> {this.state.handle} </h1>
                                <h1 class="PCL-date"> • {this.state.date} </h1>
                            </div>  

                        </div>  
                        <h1 class="PCL-row PCL-row-2 PCL-title PCL-body">{this.state.title}</h1>
                        <div class="PCL-row  PCL-row-3 PCL-body">               
                            {this.state.isURL ? (
                                <div class="PCL-content-img"> 
                                    <img src={this.state.content} alt="Content Pic"/>
                                </div >
                            ) : (
                                <h1 class="PCL-content-text">{this.state.content}</h1>
                            )} 
                        </div> 
                    </div>
                    
                </div>
                <div class="post-card-right noselect">
                        {/* <svg class="post-actions-left-background" width="193" height="40" viewBox="0 0 193 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="193" height="58" rx="20" fill="#EEEEEE"/>
                        </svg> */}
                        <span class="PCR-action PCR-action-1 center">
                            <svg class="PCR-arrow-up PCR-arrows icon" onClick={e=>this.likeHandler(e)} viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="up-arrow-elem" d="M22 0L44 26L0 26L22 0Z" fill={svg_up_arrow_color}/>
                                <path class="up-arrow-elem" d="M11.7759 26.0033L32.7759 26.0033V52.0033H11.7759V26.0033Z" fill={svg_up_arrow_color}/>
                            </svg>
                            <div class="PCR-total-likes-text-div">
                                <a class="PCR-total-likes-text" style={{color: this.getLikeColor()}} >{this.state.total_likes}</a>
                            </div>
                            <svg class="PCR-arrow-down PCR-arrows icon" onClick={e=>this.dislikeHandler(e)} viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="down-arrow-elem" d="M22 52.0033L0 26.0033H44L22 52.0033Z" fill={svg_down_arrow_color}/>
                                <path class="down-arrow-elem" d="M32.2241 26H11.2241V0H32.2241V26Z" fill={svg_down_arrow_color}/>
                            </svg>
                        </span>

        
                        {show_actions ? (
                            <span class="PCR-action PCR-action-2">
                                <svg class="PCR-edit icon" onClick={e=>this.editHandler(e)} width="1.5rem" height="1.5rem" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 31.05L0 45L13.95 40.5L4.5 31.05Z" fill="#BFBFBF"/>
                                    <path d="M29.6157 5.86141L7.66046 27.8167L17.2063 37.3625L39.1615 15.4072L29.6157 5.86141Z" fill="#BFBFBF"/>
                                    <path d="M44.325 6.975L38.025 0.675C37.125 -0.225 35.775 -0.225 34.875 0.675L32.85 2.7L42.3 12.15L44.325 10.125C45.225 9.225 45.225 7.875 44.325 6.975Z" fill="#BFBFBF"/>
                                </svg>
                                <svg class="PCR-delete icon" onClick={e=>this.deleteHandler(e)} width="1.5rem" height="1.5rem" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.6663 2.71637H27.3337V3.98186H30.825V2.53922C30.8254 1.13915 29.362 0 27.5632 0H17.4368C15.638 0 14.1746 1.13915 14.1746 2.53922V3.98186H17.6663V2.71637Z" fill="#BFBFBF"/>
                                    <path d="M38.8878 14.7437H6.11213C5.21405 14.7437 4.50707 15.3397 4.57944 16.0363L7.31957 42.3952C7.47227 43.8667 9.04997 45 10.9454 45H34.0541C35.9495 45 37.5272 43.8667 37.6799 42.3949L40.42 16.0363C40.4929 15.3397 39.7859 14.7437 38.8878 14.7437ZM14.0483 42.1885C14.0117 42.1902 13.9751 42.1913 13.9389 42.1913C13.0236 42.1913 12.2553 41.6368 12.1983 40.9165L10.4812 19.2772C10.422 18.5284 11.1542 17.884 12.1162 17.838C13.0752 17.7927 13.9071 18.3609 13.9662 19.11L15.683 40.7493C15.7425 41.4981 15.0104 42.1422 14.0483 42.1885ZM24.2652 40.8331C24.2652 41.5829 23.4837 42.1909 22.5194 42.1909C21.5551 42.1909 20.7735 41.5829 20.7735 40.8331V19.1935C20.7735 18.4433 21.5551 17.8353 22.5194 17.8353C23.4832 17.8353 24.2652 18.4433 24.2652 19.1935V40.8331ZM34.5188 19.2735L32.8793 40.9127C32.825 41.6344 32.0553 42.1909 31.1383 42.1909C31.1039 42.1909 31.069 42.1902 31.0341 42.1889C30.0716 42.1446 29.3373 41.5019 29.3942 40.7531L31.0332 19.1135C31.0897 18.3647 31.9132 17.7934 32.8784 17.8377C33.8409 17.8816 34.5753 18.5247 34.5188 19.2735Z" fill="#BFBFBF"/>
                                    <path d="M44.925 10.5524L43.7785 7.87857C43.4762 7.17373 42.628 6.69823 41.6725 6.69823H3.32702C2.37201 6.69823 1.52336 7.17373 1.2215 7.87857L0.0749643 10.5524C-0.146135 11.068 0.141603 11.594 0.678685 11.8563C0.897577 11.9631 1.15663 12.0273 1.44128 12.0273H43.5587C43.8434 12.0273 44.1029 11.9631 44.3213 11.856C44.8584 11.5937 45.1461 11.0677 44.925 10.5524Z" fill="#BFBFBF"/>
                                </svg>
                            </span> 
                        ) : ( console.log())} 
                    </div>
                <div class="PCL-row-4 PCL-comment" onClick={e=>this.commentHandler(e)} >       
                    <svg class="PCL-comment-elem " width="35" height="35" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.5 0C10.0648 0 0 10.0631 0 22.5C0 26.4465 1.02928 30.301 2.98382 33.7006L0.0848007 42.7032C-0.117416 43.3308 0.0487519 44.0188 0.514984 44.485C0.976753 44.9468 1.66306 45.1191 2.29683 44.9152L11.2994 42.0162C14.699 43.9707 18.5535 45 22.5 45C34.9352 45 45 34.9369 45 22.5C45 10.0648 34.9369 0 22.5 0ZM22.5 41.4844C18.9353 41.4844 15.4605 40.4898 12.4513 38.608C12.0184 38.3375 11.4807 38.2644 10.9805 38.4254L4.48174 40.5183L6.57463 34.0195C6.73325 33.5265 6.6663 32.9882 6.39164 32.5487C4.51023 29.5395 3.51562 26.0647 3.51562 22.5C3.51562 12.0321 12.0321 3.51562 22.5 3.51562C32.9679 3.51562 41.4844 12.0321 41.4844 22.5C41.4844 32.9679 32.9679 41.4844 22.5 41.4844ZM24.6973 22.5C24.6973 23.7133 23.7136 24.6973 22.5 24.6973C21.2864 24.6973 20.3027 23.7133 20.3027 22.5C20.3027 21.2864 21.2864 20.3027 22.5 20.3027C23.7136 20.3027 24.6973 21.2864 24.6973 22.5ZM33.4863 22.5C33.4863 23.7133 32.5027 24.6973 31.2891 24.6973C30.0754 24.6973 29.0918 23.7133 29.0918 22.5C29.0918 21.2864 30.0754 20.3027 31.2891 20.3027C32.5027 20.3027 33.4863 21.2864 33.4863 22.5ZM15.9082 22.5C15.9082 23.7133 14.9246 24.6973 13.7109 24.6973C12.4976 24.6973 11.5137 23.7133 11.5137 22.5C11.5137 21.2864 12.4976 20.3027 13.7109 20.3027C14.9246 20.3027 15.9082 21.2864 15.9082 22.5Z" fill="#BFBFBF"/>
                    </svg>
                </div> 
            </div> 
        );
    }
}

export default Post;
