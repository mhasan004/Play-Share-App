import React from "react";
import { withRouter } from 'react-router-dom';   
import Posts from "../Components/Posts";
import MakePostIcon from "../MakePostComponents/MakePostIcon"
import MakeRequest from '../../utils/MakeRequest';                                          // This will be used to make requests to the server and handle silent refresh if needed
import { isAuth, Logout} from "../../utils/Auth"                                            // isAuth - Check if user is logged in or not
import CONFIG from "../../config"
import '../../css/globalFeed.css'
const ROUTE_URL = CONFIG.API_BASE_URL + "/user/feed/"

class GlobalFeed extends React.Component{
    state = {
        posts: []
    }

    async componentDidMount() {
        if (!await isAuth(this.props))                                                      // Check if user is logged in, can refresh tokens here:
            return

        let resJson
        const reqObject = {                                                                 // Feed request object
            method: 'GET',
            mode: 'cors',
            credentials: 'include', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username': localStorage.getItem("username"),
            },
        }
        try{
            resJson = await MakeRequest(ROUTE_URL, reqObject, this.props)                   // Making get feed request
        }
        catch(err){
            console.log("Couldnt make request to API! "+err)
            return await Logout(this.props)
        }
        if (!resJson)
            return console.log("Improper Response!")
        if (resJson.status === 1)
            this.setState({
                posts: resJson.posts
            })
        else if (resJson.status === -1){
            alert("Failed to get Feed! ")
            console.log("Failed to get Feed!...")
            console.log(resJson.message )
            return await Logout(this.props)
        }
        else if (resJson.status === -3){
            console.log("status -3")
            return await Logout(this.props)
        }
        else{
            console.log("Improper or no API response!")
            console.log(resJson)
            return await Logout(this.props)
        }
    }

    render(){   
        return (
            <div class="global-feed-body">
                <span class="global-feed-nav">
                    <h1> Hello {localStorage.getItem("username")}</h1>
                    <a onClick={e=> Logout(this.props)}> Logout </a>
                </span>

                <div class="global-feed-posts">
                    <Posts posts={this.state.posts} />
                </div>
                <div class="global-feed-MakePostIcon">
                    <MakePostIcon history={this.props.history} />
                </div>

            </div>

        );
    }
    
}

export default withRouter(GlobalFeed);                  // need to export this class withRouter for redirect to work

//console.log("1: "+this.props.accessToken)
// await this.props.setAppState({
//     accessToken:"dsfa"
// })
// console.log("2: "+this.props.accessToken)