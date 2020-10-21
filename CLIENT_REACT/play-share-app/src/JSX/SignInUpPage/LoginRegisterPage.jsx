import React, {Component} from "react";
import FormContainerLogin from './FormContainerLogin'
import FormContainerRegister from './FormContainerRegister'
import OverlayContainer from './OverlayContainer'

function LoginRegisterPage() {
    return (// **** reg,log,overlay
        <div class="container" id="container">
            <FormContainerRegister />
            <FormContainerLogin />          
            <OverlayContainer />                       
        </div>
    )
}
export default LoginRegisterPage;
