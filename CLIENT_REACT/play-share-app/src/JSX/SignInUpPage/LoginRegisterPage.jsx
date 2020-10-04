import React from 'react';
import FormContainer from './FormContrainer'
import OverlayContainer from './OverlayContainer'
import Feed from '../Feed/Feed'
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";

function LoginRegisterPage() {
    return (
        <Router>
            <div class="container" id="container">
                <FormContainer formAction="login" />
                <FormContainer formAction="register" />
                <OverlayContainer />
            </div>
            
            <Route path="/register" method="POST" exact component={Feed} />      
        </Router>

    )
}

export default LoginRegisterPage;
