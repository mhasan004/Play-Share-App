import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';                                          // redirect to feed after login
import  MakeRequest  from '../../utils/MakeRequest';                                    // This will be used to make requests to the server and handle silent refresh if needed
import { isAuth } from "../../utils/Auth"                                                 // Check if user is logged in
import CONFIG from "../../config"
import FileUpload from "../Components/FileUpload"
import "../../css/makePost.css"
const ROUTE_URL = CONFIG.API_BASE_URL + "/user/post/"

class MakePost extends React.Component{
    state = {
        title: "",
        content: "",
        selectedTab: "tabText",                                                                // post, imgvid, link, 
        file: null
    }

    async componentDidMount() {
        if (!await isAuth(this.props))                                                  // Check if user is logged in, can refresh tokens here:
            return
    }
         
    handleFormPick(e){
        this.setState({content: "Text (option)"})
    }
    handleInputChange(e){
        this.setState({[e.target.name]: e.target.value})
        console.log(e.target.name)
    }
    async handleFormSubmit(e){
        e.preventDefault()
        let s3BucketURL = "url to the file"
        let isURL 
        if (this.state.selectedTab !== "tabURL")
            isURL = true
        if (this.state.selectedTab !== "tabFile"){                                                      // if we arnt 
            const reqObject = {
                method: 'POST',
                mode: 'cors',
                credentials: 'include', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'username': localStorage.getItem("username"),
                    'isURL': isURL,
                },
                body: JSON.stringify({
                    title: this.state.title,
                    content: this.state.content,
                    // group: "",
                    // group_type: ""
                })
            }
            await this.postToAPI(reqObject)       
        }
        else if (this.state.selectedTab === "tabFile") {                                                // send the title and file url to my api
            // 1) post to s3 and get link
            // 2) post to my api the s3 link
            const reqObject = {
                method: 'POST',
                mode: 'cors',
                credentials: 'include', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'username': localStorage.getItem("username"),
                    'isFile': true
                },
                body: JSON.stringify({
                    title: this.state.title,
                    content: s3BucketURL
                    // group: "",
                    // group_type: ""
                })
            }
            await this.postToAPI(reqObject)        
        }     
    }

    async postToAPI(reqObject){
        let resJson
        try{
            resJson = await MakeRequest(ROUTE_URL, reqObject, this.props)
        }
        catch(err){
            return console.log(err)
        }
        if (resJson.status === 1){
            console.log("Posted!")
            this.setState({
                title: "",
                content: "",
            })
            this.props.history.push({                                               // getting history form the props react router passed down. redirecting to global feed
                pathname: CONFIG.PATHS.GlobalFeed,
            });
        }
        else if (resJson.status === -1)
            return alert("Failed to Post! " + resJson.message ) 
    }

    tabClicked(e){
        if (e.target === null)
            return
        
        const tabDivParent = document.getElementById("makePost-tabs-div")                           // tab divs parent element
        const children = tabDivParent.children;                                                     // tab div elemtents
        const selectedTabName    = e.target.classList[0].split("-")[0]                              // tab text class name
        const selectedTabDivName = e.target.classList[0].split("-")[0] + "-div"                     // tab div class name
        
        this.setState({
            selectedTab: selectedTabName,
            content: ""
        })

        for (var i=0; i<children.length; ++i){
            if (children[i].classList[0] === "tab-spacing")                                   // ifnoring the tab divs that im using for spacing
                continue
            if (children[i].classList[0] === selectedTabDivName){
                children[i].style.background = "#2BB3FF";
                children[i].style.color = "#FFFFFF";
            }
            else{
                children[i].style.background = "#F4F4F4";
                children[i].style.color = "#000000";
            }
        }
    }

    onFileUpload = file=>{
        const data = new FormData()
        data.append('file', file)                                                           // when user uploads the file, turn the file into BINARY FILE and send it out
        this.setState({
            file: data
        })
    }
  

    
    render(){
        return(
            
            <form id="makePost-form" onSubmit={e=>this.handleFormSubmit(e)}>
                <h1 id="makePost-title" class="makePost-row">Create a post</h1>
                <div class="makePost-row noselect">
                    <div id="makePost-tabs-div" >
                        <div class="tabText-div makePost-tab-div" onClick={e=>this.tabClicked(e)}> 
                            <p class="tabText makePost-tab" onClick={e=>this.tabClicked(e)}>Text</p>    
                        </div>
                        <div class="tab-spacing"></div>
                        <div class="tabFile-div makePost-tab-div" onClick={e=>this.tabClicked(e)}> 
                            <p class="tabFile makePost-tab" onClick={e=>this.tabClicked(e)}>Img/Vid</p> 
                        </div>
                        <div class="tab-spacing" ></div>
                        <div class="tabURL-div makePost-tab-div" onClick={e=>this.tabClicked(e)}> 
                            <p class="tabURL makePost-tab" onClick={e=>this.tabClicked(e)}>URL</p>      
                        </div>
                    </div>
                </div>

                <input id="makePost-input-title" class="makePost-row makePost-input" type="text" name="title" placeholder="Title" value={this.state.title} onChange={e=>this.handleInputChange(e)} ></input>  
               
                {(this.state.selectedTab === "tabText") ? 
                    (<textarea id="makePost-content-field" class="makePost-input-content-text makePost-row makePost-input" type="text" name="content" placeholder="Text (optional)" value={this.state.content} onChange={e=>this.handleInputChange(e)} ></textarea>) : null}
                {(this.state.selectedTab === "tabFile") ? 
                    (
                        <div class="makePost-input-content-file makePost-input">
                            <FileUpload id="makePost-content-field" name="content" onFileUpload={this.onFileUpload} />
                        </div>
                    ) : null} 
                {(this.state.selectedTab === "tabURL") ? 
                    (<input id="makePost-content-field" class="makePost-input-content-url makePost-row makePost-input" type="url" name="content" placeholder="URL" value={this.state.content} onChange={e=>this.handleInputChange(e)} ></input>) : null }
                <button type="submit" id='postButton'>Post</button>  
            </form> 
        );
    }
}

export default withRouter(MakePost);                  // 3) need to export this class withRouter for redirect to work

// {(this.state.selectedTab === "tabFile") ? 
//                     (<FileUpload  onChange={e=>this.handleInputChange(e)}  name="content"/>) 
//                     : 
//                     (<textarea id="makePost-content-field" class="makePost-input-content makePost-row makePost-input" type="text" value={this.state.content} onChange={e=>this.handleInputChange(e)}  name="content" placeholder="Text (optional)" ></textarea>)                 
//                 } 
//                 {(this.state.selectedTab === "tabURL") ? 
//                     (<input type="url" value={this.state.content} onChange={e=>this.handleInputChange(e)}  name="content" placeholder="URL" ></input>) 
//                     : 
//                     (<textarea id="makePost-content-field" class="makePost-input-content makePost-row makePost-input" type="text" value={this.state.content} onChange={e=>this.handleInputChange(e)}  name="content" placeholder="Text (optional)" ></textarea>)                 
//                 }