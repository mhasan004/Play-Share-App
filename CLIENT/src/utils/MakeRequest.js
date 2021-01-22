import SilentRefresh from "./SilentRefresh"
import {Logout} from "./Auth"

let performedRequest = false
let performedRefresh = false

// This function will primarily be used to make requests to the server. It will refresh tokens if necessary. 
// Returns: {status: -1, 1}    -1=failure, 1=success. Inside: if response.status = -3 -> detects fishy behavior, will logout user 
var MakeRequest = async (ROUTE_URL, reqObject, props) => {         
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
   //! Response Status: 1, -1, -2, -3 
   if (resJson.status === 1){                                                                   // A) Success: just return res and resJson
      performedRequest = false
      performedRefresh = false
      return resJson
   }
   else if (resJson.status === -1){                                                             // B) Failure: just return res and resJson
      console.log("MakeRequest status = -1. Error: "+resJson.message)
      performedRequest = false
      performedRefresh = false
      return resJson
   }
   //! Silent Refresh: if response == -2. Perform only once 
   else if (resJson.status === -2 && !performedRefresh){                                        // C) Need refresh and remake request. Will call RefreshAndRequest() which will try to refresh tokens. If succesful, will recursively call MakeRequest() only once. If fail, will return "Failed to refresh"
      try{ 
         return RefreshAndRequest(ROUTE_URL, reqObject, resJson, props)
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
   else if (resJson.status === -3){                                                             // D) Fishy Behavior
      console.log("Fishy behavior detected, logging out!")
      alert("Fishy behavior detected, logging out!")
      return await Logout(props)
   }
   else if (resJson.status === "Failed to refresh"){
      console.log("Failed to refresh, logging out!")
      return await Logout(props)
   }
   else{      
      console.log("Improper response recieved! - " + resJson.message)                     
      const errMessage = "Improper response recieved! - " + resJson.message                     // E) API Gave Improper Response 
      throw errMessage
   }
}

// Helper function that (1) tries to refresh tokens, (2) remake the request with new tokens. 
// Returns: {status: "Failed to refresh", message: API message} or simply refreshes tokens and calls MakeRequest() 
async function RefreshAndRequest(ROUTE_URL, reqObject, resJson, props){
   performedRefresh = true
   const refresh = await SilentRefresh()                                                        // C1) Make a silent refresh request
   // C2) Refresh endpoint returns -1 --> change status to "Failed to refresh" and return, telling caller that refresh failed so need to reroute to login
   if (refresh.status === -1){
      console.log("MakeRequest refresh status = -1")
      refresh.status = "Failed to refresh"
      console.log("Failed to Refresh Tokens! Need to Redirect to Login. Error: "+refresh.message) 
      return refresh
   }
   // C3) Refresh endpoint returns 2 --> meaning silent refresh successful so redo original request
   else if (refresh.status === 2){
      console.log("MakeRequest refresh status = 2! SUCCESS")
      if (!performedRequest)
         return MakeRequest(ROUTE_URL, reqObject, props)                                        // C3) finally remake the request with new auth-token and refresh token cookies
      else{
         console.log("Failed to redo request with refreshed tokens") 
         const errMessage = "Failed to redo request with refreshed tokens! "
         throw errMessage
      }
   }
   else{                                                                                  
      console.log("Improper response recieved! - " + resJson.message) 
      const errMessage = "Improper response recieved! - " + resJson.message                     // C4) API Gave Improper Response to refresh
      throw errMessage
   }
}

export default MakeRequest
