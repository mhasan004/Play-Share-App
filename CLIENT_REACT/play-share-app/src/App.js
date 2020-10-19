import React, {Component} from "react";
import LoginRegisterPage from "./JSX/SignInUpPage/LoginRegisterPage";

class App extends Component{  
    render(){
        return (
            <div>
                <h1>REMINDER: SERVER HAS AUTH OFF FOR TESTING</h1>
                <LoginRegisterPage />
            </div>
            
        );
    }
}
export default App;



// In login & reg -> took out form button: type="submit"