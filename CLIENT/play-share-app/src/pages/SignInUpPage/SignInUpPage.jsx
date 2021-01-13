import React, {Component} from "react";
import { withRouter } from 'react-router-dom';   
import FormContainerSignIn from './FormContainerSignIn'
import FormContainerSignUp from './FormContainerSignUp'
import OverlayContainer from './OverlayContainer'
import { isAuth } from "../../utils/Auth"
import CONFIG from "../../config"
import '../../css/signInUpPage.css'

class SignInUpPage extends React.Component {
    button_signUp_overlay(){                                                // Signin will add the class
        const container = document.querySelector('#container')
        container.classList.add('right-panel-active')
        console.log("signup ")
    }

    button_signIn_overlay(){                                                // Signin with add the class
        const container = document.querySelector('#container')
        container.classList.remove('right-panel-active')
        console.log("sign in ")
    }
    async componentDidMount() {
        if (await isAuth(this.props))                                                                  // Check if user is logged in, can refresh tokens here:
            this.props.history.push({                                                                                                   // getting history form the props react router passed down. redirecting to global feed
                pathname: CONFIG.PATHS.GlobalFeed,
            });         
    
    }

    render(){
        return (// **** reg,log,overlay
            <div id="login-register-div">
            <div class="container" id="container">
                <FormContainerSignUp />
                <FormContainerSignIn />          
                <OverlayContainer button_signUp_overlay={this.button_signUp_overlay} button_signIn_overlay={this.button_signIn_overlay}/>                       
            </div>
            </div>
        )
    }
}

export default withRouter(SignInUpPage); 