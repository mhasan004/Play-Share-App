import React, {Component} from "react";
import FormContainerSignIn from './FormContainerSignIn'
import FormContainerSignUp from './FormContainerSignUp'
import OverlayContainer from './OverlayContainer'
import '../../css/signInUpPage.css'

class SignInUpPage extends React.Component {
    button_signUp_overlay(){          // signup will add the class
        const container = document.querySelector('#container')
        container.classList.add('right-panel-active')
        console.log("signup ")
    }

    button_signIn_overlay(){          // signin with add the class
        const container = document.querySelector('#container')
        container.classList.remove('right-panel-active')
        console.log("sign in ")
    }

    render(){
        return (// **** reg,log,overlay
            <div id="login-register-div">
            <div class="container" id="container">
                <FormContainerSignUp />
                <FormContainerSignIn setAppState={this.props.setAppState}/>          
                <OverlayContainer button_signUp_overlay={this.button_signUp_overlay} button_signIn_overlay={this.button_signIn_overlay}/>                       
            </div>
            </div>
        )
    }
}
export default SignInUpPage;
