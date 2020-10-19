import React, {Component} from "react";
import LoginRegisterPage from "./JSX/SignInUpPage/LoginRegisterPage";
export var API_URL_BASE = "http://157.230.184.203:8000"; // nor working
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

// export {API_URL_BASE}
export default App;



// In login & reg -> took out form button: type="submit"