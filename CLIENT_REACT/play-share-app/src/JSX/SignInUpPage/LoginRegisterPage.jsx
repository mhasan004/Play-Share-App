import React, {Component} from "react";
import FormContainerLogin from './FormContainerLogin'
import FormContainerRegister from './FormContainerRegister'
import OverlayContainer from './OverlayContainer'

class LoginRegisterPage extends React.Component {
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
            <div class="container" id="container">
                <FormContainerRegister />
                <FormContainerLogin />          
                <OverlayContainer button_signUp_overlay={this.button_signUp_overlay} button_signIn_overlay={this.button_signIn_overlay}/>                       
            </div>
        )
    }
}
export default LoginRegisterPage;
