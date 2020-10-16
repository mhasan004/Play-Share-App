import React, {Component} from "react";

class FormContainerRegister extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
    }

    handleUsername(event){        
        console.log("reg     "+event.target.value)     
        // if (event.target.value == null || event.target.value == undefined) return console.log("u")
        // console.log(event.target.value)           
        this.setState({
            username: event.target.value                    
        })
        // console.log("username :"+ this.state.username)
    }  
    handleEmail(event){
        console.log("reg     "+event.target.value )
        this.setState({
            email: event.target.value
        })
        // console.log("password :"+ this.state.email)
    } 
    handlePassword(event){
        console.log("reg     "+event.target.value)
        this.setState({
            password: event.target.value
        })
        // console.log("password :"+ this.state.password)
    }
    handleFormSubmit(event){
        // this.setState({
        //     username: event.target.value                // 3) Get form data         
        // })    
        console.log(this.state)
        event.preventDefault()                          // no refresh of screen after submit        
    }


    render(){
        // Setting the login or register form 
        const containerCss = "container-form container-sign-up";
        const heading = "Register";
        const spanText = "or use your email for registration";
        
        return (
            <div class={containerCss}>
                <form  onSubmit={this.handleFormSubmit}>
                    <h1>{heading}</h1>
                    <div class="container-social-icons">
                        <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                        <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <span>{spanText}</span>

                    <input value={this.state.username} onChange={e=>this.handleUsername(e)} type="text"     name="username" placeholder="Username" />
                    <input value={this.state.email} onChange={e=>this.handleEmail(e)} type="email"          name="email"    placeholder="Email" />
                    <input value={this.state.password} onChange={e=>this.handlePassword(e)} type="password" name="password" placeholder="Password" />
                    <button type="submit" id='signUpButton'>Sign Up</button>
                </form>
            </div>
        );
    }
}



export default FormContainerRegister;


