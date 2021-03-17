import React from 'react'
import { withRouter } from 'react-router-dom';                                          // 1) will use this to redirect to feed after login
import "../../css/makePostsIcon.css"

function MakePostIcon(props, {history}){
    function handleClick(){
        console.log("make post")
    }
    function handleOffHoverCircle(e){
        let children = Array.from(e.target.children)
        try{
            children[1].style.fill = "#2BB3FF"
            children[2].style.fill = "#2BB3FF"
        }catch{}   
    }
    function handleOnHoverCicle(e){
        let children = Array.from(e.target.children)
        try{            
            children[1].style.fill = "#00A3FF"
            children[2].style.fill = "#00A3FF"
        }catch{}   
    }
    function handleClick(){
        props.setTrigger(true)
        // history.push({                                                                  // 2) getting history form the props react router passed down. redirecting to global feed
        //     pathname: `/post`,
        // });
    }

    return(
        <div class="make-post-icon-div">
            <a href="#" class="floating-button post-floating-button" onMouseEnter={e=>handleOnHoverCicle(e)} onMouseLeave={e=>handleOffHoverCircle(e)}  onClick={e=>handleClick(e)} >
                <i class="fa fa-plus plus-icon post-floating-button"></i>
            </a>
        </div>
    );
}

export default withRouter(MakePostIcon);                                                // 3) need to export this class withRouter for redirect to work





/* Old post icon:
    <svg class="make-post-icon-background" width="231" height="230" viewBox="0 0 231 230" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.641113" width="230" height="230" rx="20" fill="white"/>
    </svg>
    <svg class="make-post-icon" onMouseEnter={e=>handleOnHoverCicle(e)} onMouseLeave={e=>handleOffHoverCircle(e)}  onClick={e=>handleClick(e)} width="151" height="150" viewBox="0 0 151 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="75.6411" cy="75.0001" r="75" fill="#F4F4F4"/>
        <rect class="make-post-plus" onClick={e=>handleClick(e)} x="61.0796" y="17.5001" width="29.1234" height="115" rx="14.5617" fill="#2BB3FF"/>
        <rect class="make-post-plus" onClick={e=>handleClick(e)} x="18.1411" y="89.5617" width="29.1234" height="115" rx="14.5617" transform="rotate(-90 18.1411 89.5617)" fill="#2BB3FF"/>
    </svg>
*/
    