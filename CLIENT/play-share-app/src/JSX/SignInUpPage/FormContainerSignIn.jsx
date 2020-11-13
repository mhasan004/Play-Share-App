import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { withRouter } from 'react-router-dom';                      // 1) will use this to redirect to feed after login
// var API_URL = require('../../App').API_URL
// var {API_URL} = require('../../App')
var API_URL = "http://localhost:8000"
const ROUTE_URL = API_URL + "/api/auth/login"


class FormContainerSignIn extends React.Component {
    state = {
        username: "",
        password: "",
    }
    handleInputChangeText(event){
        this.setState({
            [event.target.name]: event.target.value.toLowerCase()
        })
    }
    handleInputChangePass(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }
  
    async handleFormSubmit(event){
        event.preventDefault()                                       // no refresh of screen after submit 
        let resJson
        let res
        if (this.state.username === "" || this.state.password === "")
            return console.log("Need to enter username and password")
        console.log("Posting to url: "+ROUTE_URL)
        try{
            res = await fetch(ROUTE_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'credentials': 'include'                              // says to inslude read onyl cookies
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                })
            })
        }
        catch(err){
            return console.log("couldn't log in from react - failed to post to url: " + ROUTE_URL+ " Err: "+err)
        }
        try{
            resJson = await res.json()
        }
        catch(err){
            console.log("couldn't log in from react - failed to parse json from response url: " + ROUTE_URL+ " Err: "+err)
            console.log("res: "+res)
            console.log("resJson: "+resJson)
            return 
        }
       
        if (resJson.status === 1){
            this.setState({ username: "", password: ""}) 
            console.log("LOGGEDIN!")
            console.log("**WARNING: storing auth-token in local storage")            
            localStorage.setItem('auth-token', resJson.auth_app);
            console.log(localStorage.getItem('auth-token'))

            this.props.history.push({                                   // 2) getting history form the props react router passed down. redirecting to global feed
                pathname: `/globalFeed`,
            });
        }
        else
            return console.log(resJson.message) 
    }
    
    render(){
        const containerCss = "container-form container-sign-in";
        const heading = "Sign In";
        const spanText = "or use your account";
        
        return (
            <div class={containerCss}>
                <form  onSubmit={e=>this.handleFormSubmit(e)}>
                    <h1>{heading}</h1>
                    <div class="container-social-icons">
                        <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                        <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <span>{spanText}</span>

                    <input type="text"     value={this.state.username} onChange={e=>this.handleInputChangeText(e)} name="username" placeholder="Username" ></input>  
                    <input type="password" value={this.state.password} onChange={e=>this.handleInputChangePass(e)} name="password" placeholder="Password" ></input>
                    <a href="#">Forgot your password?</a>
                    <br/>
                    <br/>
                    <button type="submit" id='signInButton'>Sign In</button> 
                </form>
            </div>
        );
    }
}



export default withRouter(FormContainerSignIn);                  // 3) need to export this class withRouter for redirect to work
