const adminCB = document.getElementById('admin-cb');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const passwordCB = document.getElementById('password-cb');
const cancelBtn = document.getElementById('cancel-btn');
const createBtn = document.getElementById('create-btn');

/**
 * Function to check if email address is valid
 * @param address The email address to check
 * @return boolean True if valid address, else false
 */
const emailValid = (address) => {
    let atPos = address.indexOf('@');
    let dotPos = address.lastIndexOf('.');
    if (atPos < 1 || (dotPos - atPos < 2) || ((address.length - 1) - dotPos < 2)) {
        return false;
    } else {
        return true;
    }
};

/**
 * Function to check if password is valid
 * @param password Password to check
 * @return boolean True if valid password, else false 
 */
const passwordValid = (password) => {
    if (password.length < 6) {
        return false;
    } else {
        return true;
    }
};

// Make administrator checkbox event listener
adminCB.addEventListener('change', () => {
    if (adminCB.checked) {
        let adminConfirm = confirm('Warning! This will give the new user the option to add/remove users along with other admin tasks.' + 
                                    '\nNote that it is NOT required to be an admin to be a GM.\n\nSet new user as an administrator?');
        if (!adminConfirm) {
            adminCB.checked = false;
        } else {
            console.log('Set person as admin');
        }
    }
});

// Email address event listener for email verification
emailField.addEventListener('keyup', () => {
    let email = emailField.value;
    if (!emailValid(email)) {
        createBtn.disabled = true;
        emailField.classList.remove('valid');
        emailField.classList.add('invalid');
    } else {
        emailField.classList.remove('invalid');
        emailField.classList.add('valid');
        if (passwordValid(passwordField.value)) {
            createBtn.disabled = false;
        }
    }
});

// Password event listener for valid password
passwordField.addEventListener('keyup', () => {
    let password = passwordField.value;
    if (!passwordValid(password)) {
        createBtn.disabled = true;
        passwordField.classList.remove('valid');
        passwordField.classList.add('invalid');
    } else {
        passwordField.classList.remove('invalid');
        passwordField.classList.add('valid');
        if (emailValid(emailField.value)) {
            createBtn.disabled = false;
        }
    }
});

// Show password checkbox event listener
passwordCB.addEventListener('change', () => {
    if (passwordCB.checked) {
        passwordField.setAttribute('type', 'text');
    } else {
        passwordField.setAttribute('type', 'password');
    }
});

// Cancel button event listener
cancelBtn.addEventListener('click', () => {
    window.location.href = 'main.html';
});

// Create button event listener
createBtn.addEventListener('click', () => {
    alert('Add user');
});

const setupUI = (user) => {
    console.log(user);
};