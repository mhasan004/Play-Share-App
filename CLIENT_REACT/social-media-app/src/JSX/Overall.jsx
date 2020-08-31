import React from 'react'
function Overall(){
    return(
        <div class="container" id="container">
            <div class="container-form container-sign-up">
                <form action="register" method="POST">
                    <h1>Sign Up</h1>
                    <div class="container-social-icons">
                        <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                        <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <span>or use your email for registration</span>
                    <input type="text"     name="username" placeholder="Username" />
                    <input type="email"    name="email"    placeholder="Email" />
                    <input type="password" name="password" placeholder="Password" />
                    <button type="submit" id='signUpButton'>Sign Up</button>
                </form> 
            </div>

            <div class="container-form container-sign-in">
                <form action="login" method="POST">
                    <h1>Sign in</h1>
                    <div class="container-social-icons">
                        <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                        <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <span>or use your account</span>
                    <input type="text" name="username" placeholder="Username" />
                    <input type="password" name="password" placeholder="Password" />
                    <a href="#">Forgot your password?</a>
                    <button type="submit" id='signInButton'>Sign In</button>
                </form>
            </div>

            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">                                           
                        <h1>Welcome Back! Sign in here!</h1>
                        <p>Already have an account? Log in :)</p>
                        <button class="overlay-button" id="signInButtonOverlay">Sign In</button>
                    </div>
                    <div class="overlay-panel overlay-right">                                        
                        <h1>Hey wanna sign up?</h1>
                        <p>Don't have an account? Register one or we will find you :)</p>
                        <button class="overlay-button" id="signUpButtonOverlay">Sign Up</button>
                    </div>
                </div>
            </div>   
            
        </div>
    )
}
export default Overall;
