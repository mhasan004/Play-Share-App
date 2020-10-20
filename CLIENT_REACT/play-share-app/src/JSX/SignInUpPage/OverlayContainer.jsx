import React, {Component} from "react";
class OverlayContainer extends React.Component {
 
    render(){                                                               
        return (
            <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-panel overlay-left">
                    <h1>Welcome Back! Sign in here!</h1>
                    <p>Already have an account? Log in :)</p>
                    <button class="overlay-button" id="signInButtonOverlay" >Sign In</button>
                </div>
                <div class="overlay-panel overlay-right">
                    <h1>Hey wanna sign up?</h1>
                    <p>Don't have an account? Register one or we will find you :)</p>
                    <button class="overlay-button" id="signUpButtonOverlay" >Register</button>
                </div>
            </div>
            </div>
        )
    }
}

export default OverlayContainer;