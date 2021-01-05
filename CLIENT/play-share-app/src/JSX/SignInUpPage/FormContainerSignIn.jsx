import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { withRouter } from 'react-router-dom';                                                                                      // 1) will use this to redirect to feed after login
import VARIABLES from "../../Variables"
const ROUTE_URL = VARIABLES.API_BASE_URL + "auth/login"

class FormContainerSignIn extends React.Component {
    state = {
        username: "",
        password: "",
        errorMessage: ""
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
        event.preventDefault()                                                                                                          // no refresh of screen after submit 
        let resJson, res
        if (this.state.username === "" || this.state.password === ""){
            this.setState({ errorMesage: "Need to enter username and password"}) 
            return console.log("Need to enter username and password")
        }
        console.log("Posting to url: "+ROUTE_URL)
        try{
            res = await fetch(ROUTE_URL, {
                method: 'POST',
                credentials: 'include',                                                                                                 // says to inslude read onyl cookies
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                })
            })
        }
        catch(err){
            this.setState({ errorMessage: "Failed to log in! "+err}) 
            return console.log("couldn't log in from react - failed to post to url: " + ROUTE_URL+ " Err: "+err)
        }
        try{
            resJson = await res.json()
        }
        catch(err){
            this.setState({ errorMessage: "Failed to log in! "+err}) 
            console.log("couldn't log in from react - failed to parse json from response url: " + ROUTE_URL+ " Err: "+err)
            console.log("res: "+res)
            console.log("resJson: "+resJson)
            return 
        }
       
        if (resJson.status === 1){
            this.props.setAppState({
                loggedUser: this.state.username,
                accessToken: res.headers.get("auth-token")
            })
            localStorage.setItem('username', this.state.username);
            this.setState({ username: "", password: ""}) 
            console.log("LOGGEDIN!")
            this.props.history.push({                                                                                                   // getting history form the props react router passed down. redirecting to global feed
                pathname: VARIABLES.PATHS.GlobalFeed,
            });
        }
        else{
            this.setState({ errorMessage: resJson.message}) 
            return console.log(resJson.message) 
        }
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
                    <span color="red" >{this.state.errorMessage}</span>
                    {/* <br/> */}
                    <a href="#">Forgot your password?</a>
                    <button type="submit" id='signInButton'>Sign In</button> 

                </form>
            </div>
        );
    }
}



export default withRouter(FormContainerSignIn);                                                                     // 3) need to export this class withRouter for redirect to work
