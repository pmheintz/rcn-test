// Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get user info
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        loginForm.querySelector('#error').innerHTML = '';
        window.location.href = 'main.html';
    }).catch(err => {
        loginForm.querySelector('#error').innerHTML = '** ERROR! ** ' + err.message;
    });
});