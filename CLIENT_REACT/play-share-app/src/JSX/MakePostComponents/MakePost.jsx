import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';                      // 1) will use this to redirect to feed after login
import "./makePost.css"

var API_URL = require('../../App').API_URL
const ROUTE_URL_p1 = API_URL+"/api/user/"
const ROUTE_URL_p2 = "/make_post"

class MakePost extends React.Component{
    ROUTE_URL = ROUTE_URL_p1 +this.props.logged_user + ROUTE_URL_p2
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
    async handleFormSubmit(e){
        e.preventDefault()                                       // no refresh of screen after submit 
        let resJson = null
        try{
            const res = await fetch(this.ROUTE_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'credentials': 'include'                              // says to inslude read onyl cookies
                },
                body: JSON.stringify({
                    username: this.props.logged_user,
                    title: this.state.title,
                    content: this.state.content,
                })
            })
            const resJson = await res.json()
            if (resJson.status === 1){
                alert("Successfully Created Post!")
                this.props.history.push({                                   // 2) getting history form the props react router passed down. redirecting to global feed
                    pathname: `/globalFeed`,
                });
            }
            else
                alert("Failed to Make Post!")

        }
        catch{
            return "Couldn't make post from react!"
        }
        




        // this.props.history.push({                                   // 2) getting history form the props react router passed down. redirecting to global feed
        //     pathname: `/globalFeed`,
        // });
    }
    tabClicked(e){
        let tabTextSelected = e.target;
        let tabClassSelectedNum = parseInt(e.target.classList[0].split('tab')[1])
        let parentMain = tabTextSelected.parentNode.parentNode

        let allTabPath = parentMain.querySelectorAll(`path`)
        let allTabText = parentMain.querySelectorAll(`p`)

        for (let i=0; i<allTabPath.length; ++i){
            let tabNum = parseInt((allTabPath[i].classList[0].split('tab')[1]))
            if (tabNum===tabClassSelectedNum)
                allTabPath[i].style.fill = "#2BB3FF"
            else
                allTabPath[i].style.fill = "#F4F4F4"
        }
        for (let i=0; i<allTabText.length; ++i){
            let tabNum = parseInt((allTabText[i].classList[0].split('tab')[1]))
            if (tabNum===tabClassSelectedNum)
                allTabText[i].style.color = "white"
            else
                allTabText[i].style.color = "#848282"
        }

        if (tabClassSelectedNum === 1)
            this.setState({content: "Text (option)"})
        else if (tabClassSelectedNum === 2)
            this.setState({content: "Drag & Drop image"})
        else if (tabClassSelectedNum === 3)
            this.setState({content: "In Development"})
        

        // if (tabClassSelectedNum === 1){
        //     let contentBox = parentMain.querySelector(`.post-form-input-content`)
        //     console.log(contentBox)
        //     contentBox.style.height = "200px"
        // }
        // else{
            
        // }
    }
            
    
    render(){
        return(
            <div class="make-post-div" >
                <form class="post-form-div" onSubmit={e=>this.handleFormSubmit(e)}>
                    <h1 class="post-form-name">Create a post</h1>

                    <div class="make-post-tab-name " >
                        <p class="tab1 make-post-tab-name-post" onClick={e=>this.tabClicked(e)}>Post</p>
                        <p class="tab2 make-post-tab-name-img-vid" onClick={e=>this.tabClicked(e)}>Img/Vid</p>
                        <p class="tab3 make-post-tab-name-other" onClick={e=>this.tabClicked(e)}>Other</p>
                    </div>{/* */}
                    <div  class="make-post-tabs-div noselect" >
                        {/* <div class="tab1"> */}
                        <svg class="tab1 make-post-tab-1 make-post-tab-svg" width="131" height="57" viewBox="0 0 131 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="tab1" d="M0.26416 20.0133C0.26416 8.96761 9.21846 0.0133209 20.2642 0.0133209H110.283C121.329 0.0133209 130.283 8.96763 130.283 20.0133V31.3403C130.283 42.386 121.329 51.3403 110.283 51.3403H20.2642C9.21846 51.3403 0.26416 42.386 0.26416 31.3403V20.0133Z" fill="#2BB3FF"/>
                            <path class="tab1" d="M0.26416 36.1392H130.283V56.6813H0.26416V36.1392Z" fill="#2BB3FF"/>
                        </svg>
                        {/* </div> */}
                        {/* <div class="tab2"> */}
                        <svg class="tab2 make-post-tab-2 make-post-tab-svg" width="273" height="57" viewBox="0 0 273 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="tab2" d="M0.64502 20.0133C0.64502 8.96761 9.59933 0.0133209 20.645 0.0133209H252.189C263.235 0.0133209 272.189 8.96763 272.189 20.0133V31.3403C272.189 42.386 263.235 51.3403 252.189 51.3403H20.645C9.5993 51.3403 0.64502 42.386 0.64502 31.3403V20.0133Z" fill="#F4F4F4"/>
                            <path class="tab2" d="M0.64502 36.1392H272.189V56.6813H0.64502V36.1392Z" fill="#F4F4F4"/>
                        </svg>
                        {/* </div> */}
                        {/* <div class="tab3" > */}
                        <svg class="tab3 make-post-tab-3 make-post-tab-svg" owidth="131" height="57" viewBox="0 0 131 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="tab3" d="M0.550293 20.0133C0.550293 8.96761 9.5046 0.0133209 20.5503 0.0133209H110.57C121.615 0.0133209 130.57 8.96763 130.57 20.0133V31.3403C130.57 42.386 121.615 51.3403 110.57 51.3403H20.5503C9.50459 51.3403 0.550293 42.386 0.550293 31.3403V20.0133Z" fill="#F4F4F4"/>
                            <path class="tab3" d="M0.550293 36.1392H130.57V56.6813H0.550293V36.1392Z" fill="#F4F4F4"/>
                        </svg>              
                        {/* </div> */}
                    </div> 
                    

                    <input class="post-form-input post-form-input-title" type="text" value={this.state.title}   onChange={e=>this.handleInputChange(e)} name="title" placeholder="Title" ></input>  
                    <textarea class="post-form-input post-form-input-content " type="text" value={this.state.content} onChange={e=>this.handleInputChange(e)} name="content" placeholder="Text (option)" ></textarea>
                    <button type="submit" id='postButton'>Post</button> 
                </form>
            </div>
        );
    }
}

export default withRouter(MakePost);                  // 3) need to export this class withRouter for redirect to work
