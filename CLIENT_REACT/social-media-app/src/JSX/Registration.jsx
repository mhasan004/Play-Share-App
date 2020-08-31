import React from 'react';

function RegistrationDiv (props) {
  return (
    <div>
      <input type="text"     name="username" placeholder="Username" />
      <input type="email"    name="email"    placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit" id='signUpButton'>Sign Up</button>
    </div>   
  )
}

export default RegistrationDiv;

