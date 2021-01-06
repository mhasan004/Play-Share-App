import SilentRefresh from "./SilentRefresh"
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

   /* Response Status: 1, -1, or -2 */
   if (resJson.status === 1){                                                                   // A) Success: just return res and resJson
      performedRequest = false
      performedRefresh = false
      return resJson
   }
   else if (resJson.status === -1){                                                             // B) Failure: just return res and resJson
      console.log("MakeRequest status = -1 "+resJson.message)
      performedRequest = false
      performedRefresh = false
      return resJson
   }

   /* Silent Refresh if response == -2. Perform only once */
   else if (resJson.status === -2 && !performedRefresh){                                        // C) Need refresh and remake request 
      try{ 
         return RefreshAndRequest(ROUTE_URL, reqObject, setAppState, resJson)
      }
      catch(err){ 
         return err
      }
   }
   else if (resJson.status === -2 && performedRefresh){
      console.log("Failed refresh tokens, already tried to and failed!") 
      const errMessage = "Failed refresh tokens, already tried to and failed!"
      throw errMessage
   }
   else{      
      console.log("Improper response recieved! - " + resJson.message)                     
      const errMessage = "Improper response recieved! - " + resJson.message               // D) API Gave Improper Response 
      throw errMessage
   }
}

async function RefreshAndRequest(ROUTE_URL, reqObject, setAppState, resJson){
   performedRefresh = true
   const refresh = await SilentRefresh()                                                  // C1) Make a silent refresh request
   
   // C2) Refresh endpoint returns -1 --> change status to -3 and return, telling caller that refresh failed so need to reroute to login
   if (refresh.status === -1){
      console.log("MakeRequest refresh status = -1")
      refresh.status = -3
      console.log("Failed to Refresh Tokens! Need to Redirect to Login") 
      return refresh
   }

   // C3) Refresh endpoint returns 2 --> meaning silent refresh successful so redo original request
   else if (refresh.status === 2){
      console.log("MakeRequest refresh status = 2! SUCCESS")
      const newAccessToken = refresh.authToken                                            // C3.1) get new access token sent by api
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
      console.log("Improper response recieved! - " + resJson.message) 
      const errMessage = "Improper response recieved! - " + resJson.message           // C4) API Gave Improper Response to refresh
      throw errMessage
   }
}


export default MakeRequest
