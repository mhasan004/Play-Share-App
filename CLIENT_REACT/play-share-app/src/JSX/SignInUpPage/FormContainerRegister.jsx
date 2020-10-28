import React, {Component} from "react";
import { withRouter } from 'react-router-dom';                      // 1) will use this to redirect to feed after login
var API_URL = require('../../App').API_URL
const ROUTE_URL = API_URL+"/api/auth/register"

class FormContainerRegister extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
    }

    handleInputChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    async handleFormSubmit(event){
        event.preventDefault()                          // no refresh of screen after submit 
        const res = await fetch(ROUTE_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
            })
        })
        const resJson = await res.json()
        console.log(resJson)

        if (resJson.status === 1){
            this.setState({ username: "", email: "",  password: ""}) 
            console.log("REGISTERED!")
            this.props.history.push({                                   // 2) getting history form the props react router passed down. redirecting to global feed
                pathname: `/`,
            });
        }
        else
            console.log(resJson)
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

                    <input value={this.state.username} onChange={e=>this.handleInputChange(e)} type="text"     name="username" placeholder="Username" />
                    <input value={this.state.email}    onChange={e=>this.handleInputChange(e)} type="email"    name="email"    placeholder="Email" />
                    <input value={this.state.password} onChange={e=>this.handleInputChange(e)} type="password" name="password" placeholder="Password" />
                    <button type="submit" id='signUpButton' >Sign Up</button>
                </form>
            </div>
        );
    }
}



export default withRouter(FormContainerRegister);


