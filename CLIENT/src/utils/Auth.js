import SilentRefresh from "./SilentRefresh"
import CONFIG from "../config"
const LOGOUT_URL = CONFIG.API_BASE_URL + "/auth/logout/"

// Function check if user is logged in. Silently refresh tokens if need to. If not logged in, redirects to login. If logged in, refreshes tokens
export async function isAuth(props){                                        // Returns: true or false
    if (!localStorage.getItem("username")){
        await Logout(props)
        return false
    } 
    if ( !localStorage.getItem("access-token-exp") || (localStorage.getItem("username") && (new Date().getTime() >= localStorage.getItem("access-token-exp"))) ){ // Client cant access tokens, so... if the expiration time of token set in local storage is less than the current time, token (if there is one) is expired, so refresh
        let refresh
        try{
            refresh = await SilentRefresh()
        }
        catch(err){
            console.log("isAuth: Failed to send request to API, API may be down! " + err)      
            await Logout(props)
            return false
        }
        if (!refresh || refresh.status !== 2){
            await Logout(props)
            return false
        }    
    }
    return true
}

// Function to logout user. Deletes auth token and cookie and clears "username" from localStorage
export async function Logout(props){                                        // Returns: {status: -3}, redirects or set state of App
    console.log("Sending Logout Request..")
    const username = localStorage.removeItem("username")
    localStorage.removeItem("username")
    localStorage.removeItem("access-token-exp")
    props.history.push({                                              
        pathname: CONFIG.PATHS.SignInUpPage,
    })
    try{
        await fetch(LOGOUT_URL, {                                                
            method: 'GET',
            mode: 'cors',
            credentials: 'include', 
            headers: {
                'username': username,
            },
        })
    }
    catch(err){     
        console.log("Failed to logout!" + err)      
        const errMessage = "Failed to logout!" + err
        throw errMessage
    }
    console.log("Logging Out..")
    return {status: -3}
}





    