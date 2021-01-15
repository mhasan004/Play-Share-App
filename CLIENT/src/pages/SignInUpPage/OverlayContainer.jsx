import React, {Component} from "react";
function OverlayContainer({button_signUp_overlay, button_signIn_overlay}){
    return (
        <div class="overlay-container">
        <div class="overlay">
            <div class="overlay-panel overlay-left">
                <h1>Welcome Back! Sign in here!</h1>
                <p>Already have an account? Log in :)</p>
                <button class="overlay-button" id="signInButtonOverlay" onClick={button_signIn_overlay}>Sign In</button>
            </div>
            <div class="overlay-panel overlay-right">
                <h1>Hey wanna sign up?</h1>
                <p>Don't have an account? Register one or we will find you :)</p>
                <button class="overlay-button" id="signUpButtonOverlay" onClick={button_signUp_overlay}>Register</button>
            </div>
        </div>
        </div>
    )
}

export default OverlayContainer;