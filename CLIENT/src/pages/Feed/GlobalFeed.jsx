import React from "react";
import { withRouter } from 'react-router-dom';   
import Posts from "../Components/Posts";
import MakePostIcon from "../MakePostComponents/MakePostIcon"
import { isAuth, Logout} from "../../utils/Auth"                                            // isAuth - Check if user is logged in or not
import '../../css/globalFeed.css'

class GlobalFeed extends React.Component{
    async componentDidMount() {
        if (!await isAuth(this.props))                                                      // Check if user is logged in, can refresh tokens here:
            return
        //await this.refreshFeed()
    }

    render(){   
        return (
            <div class="global-feed-body">
                <span class="global-feed-nav">
                    <h1> Hello {localStorage.getItem("username")}</h1>
                    <a onClick={e=> Logout(this.props)}> Logout </a>
                </span>

                <div class="global-feed-posts">
                    <Posts history={this.props.history} />
                </div>
                <div class="global-feed-MakePostIcon">
                    <MakePostIcon history={this.props.history} />
                </div>

            </div>

        );
    }
    
}

export default withRouter(GlobalFeed);                  // need to export this class withRouter for redirect to work
