import React, {Component} from "react";
import LoginRegisterPage from "./JSX/SignInUpPage/LoginRegisterPage";
export var API_URL_BASE = "http://157.230.184.203:8000"; // nor working
class App extends Component{  
    render(){
        return (                                // adding a div will mess up responsive of app
            <LoginRegisterPage />
        );
    }
}

// export {API_URL_BASE}
export default App;
