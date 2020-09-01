import React from 'react';
import FormContainer from './FormContrainer'
import OverlayContainer from './OverlayContainer'

function LoginRegisterPage(props) {
  return (
    <div class="container" id="container">
      <FormContainer formAction="login" />
      <FormContainer formAction="register" />
      <OverlayContainer /> 
    </div>
  )
}

export default LoginRegisterPage;
 