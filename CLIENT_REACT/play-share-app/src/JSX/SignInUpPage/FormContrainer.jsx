import React from "react";
import LoginDiv from "./Login";
import RegistrationDiv from "./Registration";
// <FormContainer formAction="login" or "register" />

function FormContainer({formAction}) {
    let containerCss = null;
    let heading = null;
    let spanText = null;
    if (formAction === "login") {
        containerCss = "container-form container-sign-in";
        heading = "Sign In";
        spanText = "or use your account";
    } 
    else if (formAction === "register") {
        containerCss = "container-form container-sign-up";
        heading = "Register";
        spanText = "or use your email for registration";
    } else {
        console.log("Wrong formAction parameter in FormContainer.jsx 1");
    }

    return (
        <div class={containerCss}>
            <form action={formAction} method="POST">
                <h1>{heading}</h1>
                <div class="container-social-icons">
                    <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                    <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                </div>
                <span>{spanText}</span>
                {(() => {
                    if (formAction === "login") 
                        return <LoginDiv />;
                    else if (formAction === "register") 
                        return <RegistrationDiv />;
                })()}
            </form>
        </div>
    );
}

export default FormContainer;


// <form action={formAction} method="POST">
