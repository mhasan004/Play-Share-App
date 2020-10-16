import React from 'react';
import FormContainer from './FormContrainer'
import FormContainerLogin from './FormContainerLogin'
import FormContainerRegister from './FormContainerRegister'

import OverlayContainer from './OverlayContainer'
import Feed from '../Feed/Feed'
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";

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
    
    // whichOverlayHandler(event){ //event = login or register
    //     if (event.target.value == "register"){           // signup will add the class
    //         // container.classList.add('right-panel-active')
    //         console.log()
    //     }
    //     if (event.target.value == "login"){// signin with add the class
    //         // container.classList.add('right-panel-active')
    //     }
    // }
    regOverlayClicked(){
        console.log("reg")
    }
    loginOverlayClicked(){
        console.log("log")
    }


    render(){
        return (
            <div class="container" id="container">
                <FormContainerRegister logClicked={this.loginOverlayClicked} regClicked={this.regOverlayClicked}/>
                <OverlayContainer />
                <FormContainerLogin />                

                {/* <FormContainer formAction="register" /> */}
            </div>
        )
    }
}//logClicked={this.loginOverlayClicked.bind(this)} regClicked={this.regOverlayClicked.bind(this)}

export default LoginRegisterPage;
