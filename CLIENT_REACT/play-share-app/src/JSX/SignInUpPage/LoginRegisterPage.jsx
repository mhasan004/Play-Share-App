import React from 'react';
import FormContainerLogin from './FormContainerLogin'
import FormContainerRegister from './FormContainerRegister'
import OverlayContainer from './OverlayContainer'
import Feed from '../Feed/Feed'

class LoginRegisterPage extends React.Component {
    state = {
        // username: "",
        // password: "",
        // email: "",
        // username_reg: "",
        // password_reg: "",
        // email_reg: "",
        // formAction: ""
        formToFocusOn: "login"
    }
 
    render(){                                                                // **** Need OverlayContainer l;ast!
        return (
            <div class="container" id="container">
                <FormContainerRegister />
                <FormContainerLogin />          
                <OverlayContainer />                       
            </div>
        )
    }
}//logClicked={this.loginOverlayClicked.bind(this)} regClicked={this.regOverlayClicked.bind(this)}

export default LoginRegisterPage;
