const nameField = document.getElementById('name');
const nameLabel = document.getElementById('name-lbl');
const nameBtn = document.getElementById('name-btn');
const emailField = document.getElementById('email');
const emailConfField = document.getElementById('email-conf');
const emailLbl = document.getElementById('email-lbl');
const emailChk = document.getElementById('email-cb');
const emailBtn = document.getElementById('email-btn');
const passwordField = document.getElementById('password');
const passwordConfField = document.getElementById('password-conf');
const passwordChk = document.getElementById('password-cb');
const passwordBtn = document.getElementById('password-btn');
const profileImg = document.getElementById('profile-img');

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
    if (password.length < 4) {
        return false;
    } else {
        return true;
    }
};

/**
 * Function to verify 2 strings match
 * @param string1 String to compare
 * @param string2 String to compare
 * @return boolean True if strings match, else false
 */
const stringsMatch = (string1, string2) => {
    if (string1.localeCompare(string2) === 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * Function to handle verification/validation events
 * @param eventType Whether event is email or password check
 * @param activeField The field user is typing on
 * @param otherField The opposing field
 * @param activeHelperText The helper text for the active field
 * @param otherHelperText The helper text for the opposing
 */
const validationEvent = (eventType, activeField, otherField, activeHelperText, otherHelperText) => {
    // Set for password or email
    let validType, otherValidType, invalidError, matchError, successMessage, button;
    if (eventType === 'email') {
        validType = emailValid(activeField.value);
        otherValidType = emailValid(otherField.value);
        invalidError = 'Not an acceptable email address';
        matchError = 'Email addresses do not match';
        successMessage = 'Email address OK!';
        button = emailBtn;
    } else {
        validType = passwordValid(activeField.value);
        otherValidType = passwordValid(otherField.value);
        invalidError = 'Passwords must be at least 6 characters';
        matchError = 'Passwords do not match';
        successMessage = 'Password OK!';
        button = passwordBtn;
    }
    // Set fields
    if (!validType) {
        activeHelperText.setAttribute('data-error', invalidError);
        activeField.classList.remove('valid');
        activeField.classList.add('invalid');
        if (!otherValidType) {
            otherHelperText.setAttribute('data-error', invalidError);
            otherField.classList.remove('valid');
            otherField.classList.add('invalid');
        }
        button.disabled = true;
    } else {
        if (!stringsMatch(activeField.value, otherField.value)) {
            activeHelperText.setAttribute('data-error', matchError);
            otherHelperText.setAttribute('data-error', matchError);
            activeField.classList.remove('valid');
            activeField.classList.add('invalid');
            otherField.classList.remove('valid');
            otherField.classList.add('invalid');
            button.disabled = true;
        } else {
            activeHelperText.setAttribute('data-success', successMessage);
            otherHelperText.setAttribute('data-success', successMessage);
            activeField.classList.remove('invalid');
            activeField.classList.add('valid');
            otherField.classList.remove('invalid');
            otherField.classList.add('valid');
            button.disabled = false;
        }
    }
};

// Email checkbox event listener
// (Enable/disable email field, show/hide confirm email field)
emailChk.addEventListener('change', () => {
    if (emailChk.checked) {
        emailField.disabled = false;
        document.getElementById('email-cell').style.display = 'initial';
    } else {
        emailField.disabled = true;
        document.getElementById('email-cell').style.display = 'none';
    }
});

// Password checkbox event listener
// (Show/hide password and confirm password field)
passwordChk.addEventListener('change', () => {
    if (passwordChk.checked) {
        document.getElementById('password-cell').style.display = 'initial';
    } else {
        document.getElementById('password-cell').style.display = 'none';
    }
});

// Email validation event listeners
emailField.addEventListener('keyup', () => {
    let emailHT = document.getElementById('email-helper-text');
    let emailConfHT = document.getElementById('email-conf-helper-text');
    validationEvent('email', emailField, emailConfField, emailHT, emailConfHT);
});

emailField.addEventListener('blur', () => {
    let emailHT = document.getElementById('email-helper-text');
    let emailConfHT = document.getElementById('email-conf-helper-text');
    validationEvent('email', emailField, emailConfField, emailHT, emailConfHT);
});

emailConfField.addEventListener('keyup', () => {
    let emailHT = document.getElementById('email-helper-text');
    let emailConfHT = document.getElementById('email-conf-helper-text');
    validationEvent('email', emailConfField, emailField, emailConfHT, emailHT);
});

emailConfField.addEventListener('blur', () => {
    let emailHT = document.getElementById('email-helper-text');
    let emailConfHT = document.getElementById('email-conf-helper-text');
    validationEvent('email', emailConfField, emailField, emailConfHT, emailHT);
});

// Password validation event listeners
passwordField.addEventListener('keyup', () => {
    let passwordHT = document.getElementById('password-helper-text');
    let passwordConfHT = document.getElementById('password-conf-helper-text');
    validationEvent('password', passwordField, passwordConfField, passwordHT, passwordConfHT);
});

passwordField.addEventListener('blur', () => {
    let passwordHT = document.getElementById('password-helper-text');
    let passwordConfHT = document.getElementById('password-conf-helper-text');
    validationEvent('password', passwordField, passwordConfField, passwordHT, passwordConfHT);
});

passwordConfField.addEventListener('keyup', () => {
    let passwordHT = document.getElementById('password-helper-text');
    let passwordConfHT = document.getElementById('password-conf-helper-text');
    validationEvent('password', passwordConfField, passwordField, passwordConfHT, passwordHT);
});

passwordConfField.addEventListener('blur', () => {
    let passwordHT = document.getElementById('password-helper-text');
    let passwordConfHT = document.getElementById('password-conf-helper-text');
    validationEvent('password', passwordConfField, passwordField, passwordConfHT, passwordHT);
});

// Name field event listeners
nameField.addEventListener('focus', () => {
    nameField.classList.remove('valid', 'invalid');
    nameBtn.disabled = false;
});

// Setup the user interface with info from auth/firestore
const setupUI = (user) => {
    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
            console.log(user);
            var name = (user.displayName) ? user.displayName : user.email;
            var photo = (user.photoURL) ? user.photoURL : 'img/noImg.svg';
            var email = user.email;
            nameField.value = name;
            nameLabel.classList.add('active');
            emailField.value = email;
            emailLbl.classList.add('active');
            profileImg.src = photo;
        });
    } else {
        alert('An error has occurred! You are not logged in.');
    }
};

// Mateirialize components
document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    let modal = M.Modal.init(modals);
    
    var sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);
});