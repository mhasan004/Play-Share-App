import CONFIG from "../config"
const REFRESH_URL = CONFIG.API_BASE_URL + "/auth/refresh"

// Function to refresh tokens.
// Returns: {status: -1 or 2, message: API message}. If status == 2, it means silent refresh was successful, it will store new expire time of jwt in localStorage
async function SilentRefresh(){
    console.log("...Starting silent refresh...")
    let refreshRes, refreshResJson
    try{
        refreshRes = await fetch(REFRESH_URL, {                                                
            method: 'GET',
            mode: 'cors',
            credentials: 'include', 
            headers: {
                'username': localStorage.getItem("username"),
            },
        })
    }
    catch(err){     
        console.log("Silent Refresh Fail: Failed to make refresh request! " + err)      
        const errMessage = "Failed to make refresh request! " + err
        throw errMessage
    }
    try{
        refreshResJson = await refreshRes.json()
        if (refreshResJson.status === 2)
            localStorage.setItem("access-token-exp", refreshRes.headers.get("access-token-exp") )                              
        return refreshResJson
    }
    catch(err){
        console.log("Silent Refresh Fail: Failed to turn refresh response to json! " + err)                                                        
        const errMessage = "Failed to turn refresh response to json! " + err
        throw errMessage
    }
}
 
export default SilentRefresh

