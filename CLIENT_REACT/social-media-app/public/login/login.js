const button_signUp_overlay = document.querySelector('#signUpButtonOverlay')
const button_signIn_overlay = document.querySelector('#signInButtonOverlay')

const container = document.querySelector('#container')

button_signUp_overlay.addEventListener('click', () =>{          // signup will add the class
    container.classList.add('right-panel-active')
})

button_signIn_overlay.addEventListener('click', () =>{          // signin with add the class
    container.classList.remove('right-panel-active')
})






