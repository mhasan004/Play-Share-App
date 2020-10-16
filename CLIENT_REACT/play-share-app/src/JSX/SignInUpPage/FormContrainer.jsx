import React, {Component} from "react";
import LoginDiv from "./Login";
import RegistrationDiv from "./Registration";
// <FormContainer formAction="login" or "register" />

class FormContainer extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         username: "",
    //         password: "",
    //         email: "",
    //         username_reg: "",
    //         password_reg: "",
    //         email_reg: "",
    //         formAction: ""
    //     }
    //     this.handleUsername = this.handleUsername.bind(this)
    //     this.handlePassword = this.handlePassword.bind(this)

    // }
    state = {
        username: "",
        password: "",
        email: "",
        username_reg: "",
        password_reg: "",
        email_reg: "",
        formAction: ""
    }
    // state = this.props.stateP
    handleUsername(event){
        console.log(event.target.value + "   dsf")
        // if (event.target.value == null || event.target.value == undefined) return console.log("u")
        // console.log(event.target.value)
        this.setState({ 
            username: event.target.value
        });
        console.log("username :"+ this.state.username)

    }
    handlePassword(event){
        console.log(event.target.value + "   dsf")
        // if (event.target.value == null || event.target.value == undefined) return console.log("p")
        this.setState({
            password: event.target.value
        })
        console.log("password :"+ this.state.password)

    }
    handleEmail(event){
        if (event.target.value == null || event.target.value == undefined) return console.log("e")
        this.setState({
            email: event.target.value
        })
    } 
    handleFormName(event){
        if (event.target.value == null || event.target.value == undefined) return console.log("f")
        this.setState({
            formName: event.target.value
        })
    }
    
    handlePassword2(event){
      
    }
    handleEmail2(event){
    
    } 
    handleUsername2(event){
       
    }
    
    handleFormSubmit(event){
        // this.setState({
        //     username: event.target.value                // 3) Get form data         
        // })    
        console.log(this.state)
        event.preventDefault()                          // no refresh of screen after submit        
    }



    render(){
        const formAction = this.props.formAction
        // Setting the login or register form 
        let containerCss = null;
        let heading = null;
        let spanText = null;
        if (formAction === "login") {
            containerCss = "container-form container-sign-in";
            heading = "Sign In";
            spanText = "or use your account";
        } 
        else if (formAction === "register") {
            containerCss = "container-form container-sign-up";
            heading = "Register";
            spanText = "or use your email for registration";
        } else {
            console.log("Wrong formAction parameter in FormContainer.jsx 1");
        }
        
        return (
            <div class={containerCss}>
                <form onSubmit={this.handleFormSubmit}>
                    <h1>{heading}</h1>
                    <div class="container-social-icons">
                        <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                        <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <span>{spanText}</span>
                
                    <div>
                        <LoginForm state={this.state} handleUsername={e => this.handleUsername(e)}  handlePassword={e => this.handlePassword(e)} />  
                    </div>
                    <div >
                        <LoginForm state={this.state} handleUsername={e => this.handleUsername(e)}  handlePassword={e => this.handlePassword(e)} />  
                    </div>

                    {/* <div >
                        <input type="text" value={this.state.username} onChange={e=>this.handleUsername(e)}  />
                        <input type="password" value={this.state.password} onChange={e=>this.handlePassword(e)} />
                        <a href="#">Forgot your password?</a>
                        <br/>
                        <br/>
                        <button type="submit" id='signInButton'>Sign In</button> 
                    </div> */}
             
                    {/* {(() => {
                        if (formAction === "login")                 // return <LoginDiv />; // name="username" placeholder="Username" // name="password" placeholder="Password" 
                            return (<div>
                                <input value={this.state.username} onChange={e=>this.handleUsername(e)} type="text"  />
                                <input value={this.state.password} onChange={e=>this.handlePassword(e)} type="password" />
                                <a href="#">Forgot your password?</a>
                                <br/>
                                <br/>
                                <button type="submit" id='signInButton'>Sign In</button> 
                            </div> )
                        else if (formAction === "register")         // return <RegistrationDiv />;
                            return (
                                <div>
                                  <input value={this.state.username_reg} onChange={this.handleUsername2} type="text"     name="username" placeholder="Username" />
                                  <input value={this.state.email_reg} onChange={this.handleEmail2} type="email"    name="email"    placeholder="Email" />
                                  <input value={this.state.password_reg} onChange={this.handlePassword2} type="password" name="password" placeholder="Password" />
                                  <button type="submit" id='signUpButton'>Sign Up</button>
                                </div>   
                            )
                            return <RegistrationDiv />;
                    })()} */}

                </form>
            </div>
        );
    }
}

function LoginForm({state, handleUsername, handlePassword}) {                //B)  // 3) Use the "onChange" method of the textinput. call the handler function that was passed via props when onChange activates
    return ( <div >
        <input type="text"  onChange={e=>handleUsername(e)}></input>  
        <input type="password" value={state.password} onChange={e=>handlePassword(e)}></input>
        <a href="#">Forgot your password?</a>
        <br/>
        <br/>
        <button type="submit" id='signInButton'>Sign In</button> 
    </div>);
}  


export default FormContainer;


// <form action={formAction} method="POST">
