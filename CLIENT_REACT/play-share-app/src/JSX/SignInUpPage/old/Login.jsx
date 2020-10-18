import React, {Component} from 'react';

class LoginDiv extends React.Component {
    render(){
        return (
            <div>
                <input type="text" name="username" placeholder="Username" />
                <input type="password" name="password" placeholder="Password" />
                <a href="#">Forgot your password?</a>
                <br/>
                <br/>
                <button id='signInButton'>Sign In</button> 
            </div>   
        )
    }
}

export default LoginDiv;
