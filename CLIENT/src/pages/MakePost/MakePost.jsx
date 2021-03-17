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
    }

    onFileUpload = file => {
        this.setState({
            file: file
        })
    }
  
    async handleFormSubmit(e){
        e.preventDefault()
        let s3BucketURL = "url to the file"
        if (this.state.selectedTab !== "tabFile"){                                                      // not file form
            let isURL = false
            if (this.state.selectedTab === "tabURL")
                isURL = true
            const reqObject = {
                method: 'POST',
                mode: 'cors',
                credentials: 'include', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'username': localStorage.getItem("username"),
                    'isURL': isURL,
                    'isFile': false,
                },
                body: JSON.stringify({
                    title: this.state.title,
                    content: this.state.content,
                    // group: "",
                    // group_type: ""
                })
            }
            try{ 
                const postAdded = await this.postToAPI(reqObject) 
                this.props.newPostAdded(postAdded)
            } catch(err){
                alert(err)
            }       
        }

        else if (this.state.selectedTab === "tabFile") {                                                // send the title and file url to my api
            if (!this.state.file) alert("Need to pick a file!")
            const fileData = new FormData()
            fileData.append('file', this.state.file)                                                    // when user uploads the file, turn the file into BINARY FILE and send it out
            fileData.append('title', this.state.title)                                                  // appending the title field to the FormData
            const reqObject = {
                method: 'POST',
                mode: 'cors',
                credentials: 'include', 
                headers: {
                    // 'Content-Type': 'multipart/form-data',                                           // no Content-Type for fetch with file input type       
                    'username': localStorage.getItem("username"),
                    'isURL': false,
                    'isFile': true
                },
                body: fileData
            }
            try{ 
                const postAdded = await this.postToAPI(reqObject) 
                this.props.newPostAdded(postAdded)
            } catch(err){
                alert(err)
            }   
        }     
    }

    async postToAPI(reqObject){
        let resJson
        try{
            resJson = await MakeRequest(ROUTE_URL, reqObject, this.props)
        }catch(err){
            throw err
        }
        if (resJson.status === 1){
            this.setState({
                title: "",
                content: "",
            })
            this.props.setTrigger(false)
            // this.props.history.push({                                               // getting history form the props react router passed down. redirecting to global feed
            //     pathname: CONFIG.PATHS.GlobalFeed,
            // });
            return resJson.message
        }
        else if (resJson.status === -1){
            const errMesage = "Failed to Post! " + resJson.messag
            throw (errMesage)
        }
        else
            throw "Didnt get proper mesage from API "
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

    

    
    render(){
        return(
            
            <form id="makePost-form" onSubmit={e=>this.handleFormSubmit(e)}>
                <h1 id="makePost-title" class="makePost-row">Create a post</h1>
                <div class="makePost-row makePost-tab-row noselect">
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
