import React, {Component} from "react";

class FormContainerLogin extends React.Component {
    state = {
        username: "",
        password: "",
    }

    handleUsername(event){        
        console.log("log     "+event.target.value)     
        // if (event.target.value == null || event.target.value == undefined) return console.log("u")
        // console.log(event.target.value)           
        this.setState({
            username: event.target.value                    
        })
        // console.log("username :"+ this.state.username)
    }   
    handlePassword(event){
        console.log("log     "+event.target.value)
        // if (event.target.value == null || event.target.value == undefined) return console.log("p")
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
        const containerCss = "container-form container-sign-in";
        const heading = "Sign In";
        const spanText = "or use your account";
        
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

                    <input type="text"     value={this.state.username} onChange={e=>this.handleUsername(e)}></input>  
                    <input type="password" value={this.state.password} onChange={e=>this.handlePassword(e)}></input>
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


