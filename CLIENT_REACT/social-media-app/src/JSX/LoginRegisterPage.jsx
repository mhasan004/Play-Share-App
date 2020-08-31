import React from 'react';
import FormContainer from './FormContrainer'
import OverlayContainer from './OverlayContainer'
import Overall from './Overall'


function LoginRegisterPage(props) {
  return (
    <div class="container" id="container">
      <FormContainer formAction="register" />
      <FormContainer formAction="login" />
      <OverlayContainer /> 
    </div>
  )
}

export default LoginRegisterPage;
 

{/* <Overall /> */}
