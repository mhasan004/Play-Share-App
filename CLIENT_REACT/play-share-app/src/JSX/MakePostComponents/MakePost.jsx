import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';                      // 1) will use this to redirect to feed after login
import "./makePost.css"

class MakePost extends React.Component{
    state = {
        title: "",
        content: "",
        formTab: "post",       //post, imgvid, link, 
    }

    handleFormPick(e){
        this.setState({content: "Text (option)"})
    }
    handleInputChange(e){
        this.setState({[e.target.name]: e.target.value})
    }
    handleFormSubmit(e){
        e.preventDefault()                                       // no refresh of screen after submit 
        this.props.history.push({                                   // 2) getting history form the props react router passed down. redirecting to global feed
            pathname: `/globalFeed`,
        });
        // this.setState({
        // )

    }
    render(){
        // if (this.state.formTab === "post")
        //     this.setState({content: "Text (option)"})
        // else if (this.state.formTab === "imgvid")
        //     this.setState({content: "Drag & Drop image"})
        // else if (this.state.formTab === "link")
        //     this.setState({content: "In Development"})

        return(
            <div class="make-post-div" >
                <h1 class="post-form-name">Create a post</h1>

                {/* <svg class="make-post-tabs" width="544" height="57" viewBox="0 0 544 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="make-post-tab-1a" d="M0.738281 20.1174C0.738281 9.07166 9.69259 0.117371 20.7383 0.117371H110.758C121.803 0.117371 130.758 9.07168 130.758 20.1174V31.4444C130.758 42.4901 121.803 51.4444 110.758 51.4444H20.7383C9.69258 51.4444 0.738281 42.4901 0.738281 31.4444V20.1174Z" fill="#2BB3FF"/>
                    <path class="make-post-tab-1b" d="M0.738281 36.2432H130.758V56.7854H0.738281V36.2432Z" fill="#2BB3FF"/>
                    
                    <path class="make-post-tab-2a" d="M413.024 20.1174C413.024 9.07166 421.979 0.117371 433.024 0.117371H523.044C534.089 0.117371 543.044 9.07168 543.044 20.1174V31.4444C543.044 42.4901 534.089 51.4444 523.044 51.4444H433.024C421.979 51.4444 413.024 42.4901 413.024 31.4444V20.1174Z" fill="#F4F4F4"/>
                    <path class="make-post-tab-2a" d="M413.024 36.2432H543.044V56.7854H413.024V36.2432Z" fill="#F4F4F4"/>
                    
                    <path class="make-post-tab-3a" d="M136.119 20.1174C136.119 9.07166 145.073 0.117371 156.119 0.117371H387.664C398.709 0.117371 407.664 9.07168 407.664 20.1174V31.4444C407.664 42.4901 398.709 51.4444 387.664 51.4444H156.119C145.073 51.4444 136.119 42.4901 136.119 31.4444V20.1174Z" fill="#F4F4F4"/>
                    <path class="make-post-tab-3a" d="M136.119 36.2432H407.664V56.7854H136.119V36.2432Z" fill="#F4F4F4"/>
                    
                    <line class="make-post-tab-line" x1="0.738281" y1="56.2853" x2="543.044" y2="56.2853" stroke="#F4F4F4"/>
                </svg> */}
                
                <form class="post-form-div" onSubmit={e=>this.handleFormSubmit(e)}>
                    <input class="post-form-input" type="text" value={this.state.title}   onChange={e=>this.handleInputChange(e)} name="title" placeholder="Title" ></input>  
                    <input class="post-form-input" type="text" value={this.state.content} onChange={e=>this.handleInputChange(e)} name="content" placeholder="Text (option)" ></input>
                    <button type="submit" id='postButton'>Post</button> 
                </form>







            </div>
        );
    }
}

export default withRouter(MakePost);                  // 3) need to export this class withRouter for redirect to work
