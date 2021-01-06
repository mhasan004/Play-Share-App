import React, {Component} from "react";
import { withRouter } from 'react-router-dom';                      // 1) will use this to redirect to feed after login
import CONFIG from "../../utils/config"
const ROUTE_URL = CONFIG.API_BASE_URL + "auth/register"

class FormContainerSignUp extends React.Component {
    state = {
        username: "",
        email: "",
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
        event.preventDefault()                          // no refresh of screen after submit 
        let resJson, res
        if (this.state.username === "" || this.state.password === ""|| this.state.email === ""){
            this.setState({ errorMessage: "Need to enter username, email, and password"}) 
            return console.log("Need to enter username, email, and password")
        }
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
                    email: this.state.email,
                    password: this.state.password,
                })
            })
        }
        catch(err){
            this.setState({ errorMessage: "Failed to Signup!"+err}) 
            return console.log("couldn't log in from react - failed to post to url: " + ROUTE_URL+ " Err: "+err)
        }
        try{
            resJson = await res.json()
        }
        catch(err){
            this.setState({ errorMessage: "Failed to Signup!"+err}) 
            console.log("couldn't Signup from react - failed to parse json from response url: " + ROUTE_URL+ " Err: "+err)
            console.log("res: "+res)
            console.log("resJson: "+resJson)
            return 
        }

        if (resJson.status === 1){
            this.setState({ username: "", email: "",  password: ""}) 
            console.log("REGISTERED!")
            this.props.history.push({                                                                                       // 2) getting history form the props react router passed down. redirecting to global feed
                pathname: CONFIG.PATHS.GlobalFeed,
            });
        }
        else{
            this.setState({ errorMessage: "Failed to Signup!"+resJson}) 
            console.log(resJson)
        }
    }

    render(){
        // Setting the login or register form 
        const containerCss = "container-form container-sign-up";
        const heading = "Register";
        const spanText = "or use your email for registration";
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

                    <input value={this.state.username} onChange={e=>this.handleInputChangeText(e)} type="text"     name="username" placeholder="Username" />
                    <input value={this.state.email}    onChange={e=>this.handleInputChangeText(e)} type="email"    name="email"    placeholder="Email" />
                    <input value={this.state.password} onChange={e=>this.handleInputChangePass(e)} type="password" name="password" placeholder="Password" />
                    <span color="red" >{this.state.errorMessage}</span>
                    <button type="submit" id='signUpButton' >Sign Up</button>
                </form>
            </div>
        );
    }
}



export default withRouter(FormContainerSignUp);


