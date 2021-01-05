import VARIABLES from "./Variables"
const REFRESH_URL = VARIABLES.API_BASE_URL + "auth/refresh"
let performedRequest = false
let performedRefresh = false

// This function will be used to make requests to the server and handle silent refresh if needed
var MakeRequest = async (ROUTE_URL, reqObject, setAppState) => {         
   let res, resJson
   try{
      res = await fetch(ROUTE_URL, reqObject)
   }
   catch(err){
      const errMessage = "Couldn't make fetch request! " + err
      throw errMessage
   }
   try{
      resJson = await res.json()
   }
   catch(err){
      const errMessage = "Failed to turn response to json! " + err
      throw errMessage
   }

   /* Response Status */
   if (resJson.status === 1){                                                                 // A) Success: just return res and resJson
      performedRequest = false
      performedRefresh = false
      return {res, resJson}
   }
   else if (resJson.status === -1){                                                          // B) Failure: just return res and resJson
      performedRequest = false
      performedRefresh = false
      return {res, resJson}
   }
   else if (resJson.status === -2 && !performedRefresh){                                     // C) Need refresh and remake request 
      console.log("------------Starting refresh...")
      performedRefresh = true
      let refreshRes, refreshResJson
      try{
         console.log(REFRESH_URL)                                                  
         refreshRes = await fetch(REFRESH_URL, {                                             // C1) Make a silent refresh request
            method: 'GET',
            mode: 'cors',
            credentials: 'include', 
         })
      }
      catch(err){     
         console.log("Silent Refresh Fail: Failed to make refresh request! " + err)      
         const errMessage = "Failed to make refresh request! " + err
         throw errMessage
      }
      try{
         refreshResJson = await refreshRes.json()
      }
      catch(err){
         console.log("Silent Refresh Fail: Failed to turn refresh response to json! " + err)                                                        
         const errMessage = "Failed to turn refresh response to json! " + err
         throw errMessage
      }

      // C2) Refresh endpoint returns -1 --> change status to -3 telling client to reroute to login
      if (refreshResJson.status === -1){
         refreshResJson.status = -3
         console.log("Failed to Refresh Tokens! Need to Redirect to Login") 
         return {refreshRes, refreshResJson}
      }

      // C3) Refresh endpoint returns 2 --> meaning silent refresh successful so redo original request
      else if (refreshResJson.status === 2){
         const newAccessToken = refreshRes.headers.get("auth-token")                         // C3.1) get new access token sent by api
         setAppState({
            accessToken: newAccessToken                                                      // C3.2) set app's accessToken state to new accessToken
         })
         reqObject.headers["auth-token"] = newAccessToken                                    // C3.3) change the request object auth-token header to the new one so that we can mak enew request
         if (!performedRequest)
            return MakeRequest(ROUTE_URL, reqObject, setAppState)                            // C3.4) finally remake the request with new auth-token and refresh token cookie
         else{
            console.log("Failed to redo request with refreshed tokens") 
            const errMessage = "Failed to redo request with refreshed tokens! "
            throw errMessage
         }
      }

      else{                                                                                  
         console.log("Improper response recieved (D) - " + resJson.message) 
         const errMessage = "Improper response recieved (C)! - " + resJson.message           // C4) API Gave Improper Response to refresh
         throw errMessage
      }
   }
   else{      
      console.log("Improper response recieved (D) - " + resJson.message)                     
      const errMessage = "Improper response recieved! (D) - " + resJson.message              // D) API Gave Improper Response 
      throw errMessage
   }
}


export default MakeRequest
