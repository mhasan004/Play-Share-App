import React from "react";
import Posts from "../Components/Posts";
import MakePostIcon from "../MakePostComponents/MakePostIcon"
import { withRouter } from 'react-router-dom';   
import SilentRefresh from "../../utils/SilentRefresh"
import MakeRequest from '../../utils/MakeRequest';                                  // This will be used to make requests to the server and handle silent refresh if needed
import CONFIG from "../../utils/config"
import '../../css/globalFeed.css'
const ROUTE_URL = CONFIG.API_BASE_URL + "user/feed/"

class GlobalFeed extends React.Component{
    state = {
        loggedUser: localStorage.getItem('username'),
        posts: []
    }

    async componentDidMount() {
        // Silent Refreshing to stay loged in:
        if (localStorage.getItem("username") && !this.props.accessToken){
            const refresh = await SilentRefresh()
            if (refresh.status === -1){
                this.props.history.push({                                              
                    pathname: CONFIG.PATHS.SignInUpPage,
                });
            }
            else if (refresh.status === 2){
                this.props.setAppState({
                    accessToken: refresh.authToken                                                    
                })
            }
        }
        if (!localStorage.getItem("username") || !this.props.accessToken){
            return this.props.history.push({                                              
                pathname: CONFIG.PATHS.SignInUpPage,
            });
        }

        // Getting Feed:
        let resJson
        const reqObject = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username': localStorage.getItem("username"),
                'auth-token': this.props.accessToken,
            },
        }
        try{
            resJson = await MakeRequest(ROUTE_URL, reqObject, this.props.setAppState)
        }
        catch(err){
            return console.log(err)
        }
        if (!resJson)
            return console.log("Improper Response!")
        if (resJson.status === 1){
            this.setState({
                posts: resJson.posts
            })
        }
        else if (resJson.status === -1)
            return alert("Failed to get Feed! " + resJson.message )
        else if (resJson.status === -3){
            this.props.history.push({                                              
                pathname: CONFIG.PATHS.SignInUpPage,
            });
        }
    }

    render(){                
        return (
            <div class="global-feed-body">
                <span class="global-feed-nav">
                    <h1> Hello {localStorage.getItem("username")}</h1>
                    <a> Logout</a>
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