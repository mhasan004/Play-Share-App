import React from 'react';

function RegistrationDiv() {
  return (
    <div>
      <input type="text"     name="username" placeholder="Username" />
      <input type="email"    name="email"    placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button  id='signUpButton'>Sign Up</button>
    </div>   
  )
}

export default RegistrationDiv;

