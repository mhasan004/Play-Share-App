import React, { Component } from "react"
import "../../css/fileUpload.css"

class FileUpload extends React.Component {
    state = {
        uploadedFile: this.props.uploadedFile
    }
    onChangeHandler = e => {            
        this.setState({ 
            uploadedFile: e.target.files[0],                                                // get the file that was uploaded and save it to the state
        })
        this.props.onFileUpload(e.target.files[0])
    }
    render(){
        return(        
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group files">
                        <input class="form-control" type="file" name="file" onChange={this.onChangeHandler} multiple="" accept = ".png, .jpg, .img, .jpg, .gif, .mov, .mkv, .mp4" />
                    </div>
                </div>
            </div>
        );
    }
}

export default FileUpload
