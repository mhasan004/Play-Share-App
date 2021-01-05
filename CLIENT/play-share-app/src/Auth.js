import  MakeRequest  from './MakeRequest';                                  // This will be used to make requests to the server and handle silent refresh if needed
import VARIABLES from "./Variables"
const REFRESH_URL = VARIABLES.API_BASE_URL + "auth/refresh"

function Auth(loggedUser, setAppState){
    console.log("---------------------")

    setAppState({
        loggedUser : "dsfsfsfdsf"
    })
    console.log(loggedUser)

    // Case 1: If there is a username in localStorage, chances are that they logged in and there is a RF, so do silent refresh
    // const loggedUser = localStorage.getItem("username")
    // if (props.loggedUser === "" && loggedUser)
    //     setAppState({
    //         loggedUser: loggedUser
    //     })


    // if (this.props.accessToken.length < 1 && loggedUser === "" ){
    //     this.props.history.push({                                  
    //         pathname: `/login`,
    //     })
    // }
    // if (this.props.accessToken.length < 1){
    //     let resJson
    //     try{
    //         const reqObj = {                                            
    //             method: 'GET',
    //             mode: 'cors',
    //             credentials: 'include', 
    //         }
    //         const requestObj = await MakeRequest(REFRESH_URL, reqObj, this.props.setAppState)
    //         resJson = requestObj.resJson
    //     }
    //     catch(err){
    //         return console.log(err)
    //     }
    //     if (resJson.status === 1){
    //         console.log("Posted!")
    //         this.props.history.push({                                               // getting history form the props react router passed down. redirecting to global feed
    //             pathname: `/feed`,
    //         });
    //         this.setState({
    //             title: "",
    //             content: "",
    //         })
    //     }
    //     else if (resJson.status === -1)
    //         return alert("Failed to Post! " + resJson.message )
    //     else if (resJson.status === -3){
    //         // this.props.setAppState({
    //         //     loggedUser: "",
    //         //     accessToken: ""
    //         // })
    //         this.props.history.push({                                               // getting history form the props react router passed down. redirecting to global feed
    //             pathname: `/`,
    //         });
    //     }
    // }
    return(<div> Authenticating... </div>)
}

export default Auth;
