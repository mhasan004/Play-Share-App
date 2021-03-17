import React from 'react'
import "../../css/Popup.css"
import MakePost from "../MakePost/MakePost"

function Popup(props) {
    return (props.trigger) ? (                                                                               // if props.triggered==treu, run the popup, else return a "". 
        <div className='popup'> 
             {/* <MakePost setTrigger={(bool)=>this.setButtonPopup(bool)} adPost={post => this.newPostAdded(post)}/> */}
            {/* <div className='popup-inner'> */}
                {/* <button className='close-btn' onClick={()=>props.setTrigger(false)}>Close</button> */}
                { props.children }
            {/* </div> */}
        </div>
    ) : ""
}

export default Popup
