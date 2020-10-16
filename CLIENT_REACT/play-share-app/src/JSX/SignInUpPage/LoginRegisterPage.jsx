import React from 'react';
import FormContainer from './FormContrainer'
import OverlayContainer from './OverlayContainer'
import Feed from '../Feed/Feed'
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";

class LoginRegisterPage extends React.Component {
    state = {
        username: "",
        password: "",
        email: "",
        username_reg: "",
        password_reg: "",
        email_reg: "",
        formAction: ""
    }
    render(){
        return (
            <div class="container" id="container">
                <FormContainer formAction="login" stateP = {this.state}/>
                <FormContainer formAction="register" />
                <OverlayContainer />
            </div>
        )
    }
}

export default LoginRegisterPage;
