import React, {Component} from "react";
import LoginRegisterPage from "./JSX/SignInUpPage/LoginRegisterPage";

class App extends Component{  
    render(){
        return (
            <LoginRegisterPage />
        );
    }
}
export default App;



// In login & reg -> took out form button: type="submit"