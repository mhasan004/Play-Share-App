import React, {Component} from "react";
import FormContainerLogin from './FormContainerLogin'
import FormContainerRegister from './FormContainerRegister'
import OverlayContainer from './OverlayContainer'
class LoginRegisterPage extends React.Component {
    render(){                                                                // **** reg,log,overlay
        return (
            <div class="container" id="container">
                <FormContainerRegister />
                <FormContainerLogin />          
                <OverlayContainer />                       
            </div>
        )
    }
}
export default LoginRegisterPage;
