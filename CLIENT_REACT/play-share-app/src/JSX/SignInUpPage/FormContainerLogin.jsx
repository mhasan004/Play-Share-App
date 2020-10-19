import React, {Component} from "react";
// const CryptoJS = require("crypto-js")
let API_URL = "http://157.230.184.203:8000"+"/api/auth/login"


class FormContainerLogin extends React.Component {
    state = {
        username: "",
        password: "",
    }

    // handleUsername(event){        
    //     console.log("log username    "+event.target.value)       
    //     this.setState({
    //         username: event.target.value                    
    //     })
    // }   
    // handlePassword(event){
    //     console.log("log password    "+event.target.value)
    //     this.setState({
    //         password: event.target.value
    //     })
    // }
    handleInputChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    async handleFormSubmit(event){
        event.preventDefault()                          // no refresh of screen after submit 
        // CryptoJS.AES.encrypt(unique_user_secret_key, process.env.ADMIN_SECRET_KEY).toString();
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        })
        const data = await res.json()
        if (data.status == 1){
            this.setState({ username: "", password: ""}) 
            console.log("LOGGEDIN!")
        }
        else
            console.log(data)
    }


    render(){
        // Setting the login or register form 
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

                    <input type="text"     value={this.state.username} onChange={e=>this.handleInputChange(e)} name="username" placeholder="Username" ></input>  
                    <input type="password" value={this.state.password} onChange={e=>this.handleInputChange(e)} name="password" placeholder="Password" ></input>
                    <a href="#">Forgot your password?</a>
                    <br/>
                    <br/>
                    <button type="submit" id='signInButton'>Sign In</button> 
                </form>
            </div>
        );
    }
}



export default FormContainerLogin;


