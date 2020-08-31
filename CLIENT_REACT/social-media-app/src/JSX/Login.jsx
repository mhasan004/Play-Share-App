import React from 'react';

function LoginDiv () {
  return (
    <div>
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <a href="#">Forgot your password?</a>
      <button type="submit" id='signInButton'>Sign In</button> 
    </div>   
  )
}

export default LoginDiv;
