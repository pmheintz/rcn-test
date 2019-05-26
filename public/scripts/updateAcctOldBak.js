const updateBtn = document.getElementById('update-acct');
const cancelBtn = document.getElementById('cancel-acct');
const uploader = document.getElementById('uploader');
const fileButton = document.getElementById('file-button');
const uploadStatus = document.getElementById('upload-status');
const emailChk = document.getElementById('email-cb');
const passwordChk = document.getElementById('password-cb');
let emailField = document.getElementById('email');
let emailConfField = document.getElementById('emailConf');
let emailConfCell = document.getElementById('emailConfCell');
let passwordField = document.getElementById('password');
let passwordConfField = document.getElementById('passwordConf');
let passwordCell = document.getElementById('passwordCell');
let passwordConfCell = document.getElementById('passwordConfCell');
let emailMatch = false;
let passwordMatch = false;

/**
 * Function to update user profile
 * @param user The user to update
 * @param info Object containing the updated info
 * @return Promise
 */
const updateUser = (user, info) => {
    console.log('Updating user');
    return user.updateProfile(info).then(() => {
        console.log('Profile updated');
    }).catch((err) => {
        console.log(err);
    });
};

/**
 * Function to update user email address
 * @param user The user whos email will be updated
 * @param email The new email address
 * @return Promise 
 */
const updateEmail = (user, email) => {
    console.log('Updating email address');
    return user.updateEmail(email).then(() => {
        console.log('Email address updated');
    }).catch((err) => {
        console.log(err);
    });
}

/**
 * Function to update the user's password
 * @param user The user whos password will be changed
 * @param password The new password
 * @return Promise 
 */
const updatePassword = (user, password) => {
    console.log('Changing password');
    return user.updatePassword(password).then(() => {
        console.log('Password updated');
    }).catch((err) => {
        console.log(err);
    });
}
 
/**
 * Function to verify a file is an image
 * @param file The file to verify
 * @return True if image, False if not
 */
const verifyImage = (file) => {
    console.log('Verifying file.');
    if (file.type.slice(0, file.type.indexOf('/')) === 'image') {
        console.log('File is an image.');
        return true;
    } else {
        console.log('File is NOT an image.');
        return false;
    }
};

/**
 * Function to delete user's profile image
 * @param user The user who's image will be deleted
 * @return Promise
 */
const deleteImage = (user) => {
    console.log('Deleting image.');
    // Get previous file extension
    let regex = /(?:\.([^.]+))?$/;
    let extension = regex.exec(user.photoURL)[1];
    let x = extension.indexOf('?');
    extension = extension.substring(0, x != -1 ? x : extension.length);

    // Create storage reference
    let storageRef = storage.ref('userImages/' + user.uid + '.' + extension);

    // Delete Image
    return storageRef.delete().then(() => {
        console.log('Previous image deleted!');
    }).catch((err) => {
        console.log(err);
    });
};

/**
 * Function to upload the user's image and update the photoURL
 * @param user The user who's image is being uploaded
 * @param photo The photo to upload
 * @return Promise
 */
const uploadImage = (user, photo) => {
    // Create storage reference
    let storageRef = storage.ref('userImages/' + user.uid + '.' + photo.name.split('.').pop());

    // Disable UI while uploading
    uploadStatus.style.display = 'initial';
    updateBtn.disabled = true;

    // Create upload task
    let uploadTask = storageRef.put(photo);

    // Create promise
    return new Promise((resolve, reject) => {
        // Handle async task
        uploadTask.on('state_changed', 
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploader.style.width = percentage + '%';
                document.getElementById('num-percent').innerHTML = Math.round(percentage) + '%';
            },
            function error(err) {
                errors.push(err);
                document.getElementById('num-percent').innerHTML = err;
                reject(err);
            }, 
            function complete() {
                updateBtn.disabled = false;
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    document.getElementById('num-percent').classList.add('green-text');
                    document.getElementById('num-percent').innerHTML = 'Upload Complete!';
                    console.log(downloadURL);
                    resolve(
                        updateUser(user, {photoURL: downloadURL}).then(() => {
                            console.log('New image uploaded');
                        }).catch((err) => {
                            console.log('Error uploading image');
                        })
                    );
                });
            }
        );
    });
};

/**
 * Update button event listener
 */
updateBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Create array of promises to be itterated over
    let promises = [];

    // Get current user
    let user = firebase.auth().currentUser; 

    // Get display name variable
    let name = (document.getElementById('name').value) ? document.getElementById('name').value : null;

    // Add updateUser to promises
    promises.push(updateUser(user, {displayName: name}));

    // Check if a file has been selected
    if (document.getElementById('file-button').files[0]) {
        // File has been selected, Verify file is an image
        if (verifyImage(document.getElementById('file-button').files[0])) {
            // File is an image. Check if previous image exists
            if (user.photoURL) {
                // Previous image exists, push delete to promises
                promises.push(deleteImage(user));
                // Push promise to remove previous photoURL
                promises.push(updateUser(user, {photoURL: null}));
            }
            // Push promise to upload new image
            promises.push(uploadImage(user, document.getElementById('file-button').files[0]));
        } else {
            // File is not an image
            alert('File selected is not an acceptable image.\nMake sure the file is jpeg, gif, png, bmp, or webp.');
        }
    }

    // Add updatePassword if needed
    if (passwordChk.checked) { promises.push(updatePassword(user, passwordField.value)); }

    // Add updateEmail promise if needed
    if (emailChk.checked) { promises.push(updateEmail(user, emailField.value)); }

    // All tasks should be checked, execute async tasks
    Promise.all(promises).then(() => {
        alert('Profile has been updated!');
        window.location.href = 'main.html';
    }).catch(() => {
        alert('An error occurred updating your profile.\n');
    })
});

// Email change checkbox event listener
emailChk.addEventListener('change', () => {
    if (emailChk.checked) {
        updateBtn.disabled = true;
        emailField.disabled = false;
        emailConfCell.style.display = 'initial';
    } else {
        if (passwordChk.checked === false || (passwordMatch && passwordField.value.length >= 4)) {
            updateBtn.disabled = false;
        }
        emailField.disabled = true;
        emailConfCell.style.display = 'none';
    }
});

// Password change checkbox event listener
passwordChk.addEventListener('change', () => {
    if (passwordChk.checked) {
        updateBtn.disabled = true;
        passwordCell.style.display = 'initial';
        passwordConfCell.style.display = 'initial';
    } else {
        if (emailChk.checked === false || emailMatch) {
            updateBtn.disabled = false;
        }
        passwordCell.style.display = 'none';
        passwordConfCell.style.display = 'none';
    }
});

// Email validation focus out event listener
emailField.addEventListener('focusout', () => {
    let address = emailField.value;
    let atpos = address.indexOf("@");
    let dotpos = address.lastIndexOf(".");
    if (atpos < 1 || ( dotpos - atpos < 2 )) {
        let emailHelperText = document.getElementById('email-helper-text');
        emailHelperText.setAttribute('data-error', 'Not a valid email address');
        emailField.classList.add('invalid');
        updateBtn.disabled = true;
    }
});

// Email confirmation on key up event listener
emailConfField.addEventListener('keyup', () => {
    let email = document.getElementById('email').value;
    let emailConf = document.getElementById('emailConf').value;
    let emailConfHelperText = document.getElementById('emailConf-helper-text');
    if (email.localeCompare(emailConf) === 0) {
        emailConfField.classList.remove('invalid');
        emailConfField.classList.add('valid');
        emailMatch = true;
        if (passwordMatch || !passwordChk.checked) {
            updateBtn.disabled = false;
        }
    } else {
        emailConfHelperText.setAttribute('data-error', 'Email addresses do not match!');
        emailConfField.classList.remove('valid');
        emailConfField.classList.add('invalid');
        emailMatch = false;
        updateBtn.disabled = true;
    }
});

// Password length focus out event listener
passwordField.addEventListener('focusout', () => {
    let passwd = passwordField.value;
    let passwordHelperText = document.getElementById('password-helper-text');
    if (passwd.length < 4) {
        passwordHelperText.setAttribute('data-error', 'Password must be at least 4 characters');
        passwordField.classList.add('invalid');
        updateBtn.disabled = true;
    } else {
        passwordHelperText.setAttribute('data-error', '');
        passwordField.classList.remove('invalid');
        passwordField.classList.add('valid');
    }
});

// Password confirmation on key up event listener
passwordConfField.addEventListener('keyup', () => {
    let password = document.getElementById('password').value;
    let passwordConf = document.getElementById('passwordConf').value;
    let passwordConfHelperText = document.getElementById('passwordConf-helper-text');
    if (password.localeCompare(passwordConf) === 0) {
        passwordConfField.classList.remove('invalid');
        passwordConfField.classList.add('valid');
        passwordMatch = true;
        if ((emailMatch || !emailChk.checked) && password.length >= 4) {
            updateBtn.disabled = false;
        }
    } else {
        passwordConfHelperText.setAttribute('data-error', 'Passwords do not match!');
        passwordConfField.classList.remove('valid');
        passwordConfField.classList.add('invalid');
        passwordMatch = false;
        updateBtn.disabled = true;
    }
});

// Cancel update event listener
cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'main.html';
});

// Setup the user interface with info from auth/firestore
const setupUI = (currentUser) => {
    if (currentUser) {
        db.collection('users').doc('user.uid').get().then(doc => {
            let email = currentUser.email;
            let displayName = (currentUser.displayName) ? currentUser.displayName : '';
            if (email) {
                // Add active class to prevent overlapping with materialize
                document.getElementById('email-lbl').classList.add('active');
                let emailField = document.getElementById('email');
                emailField.value = email;
                emailField.disabled = true;
            }
            if (displayName) {
                // Add active class to prevent overlapping with materialize
                document.getElementById('name-lbl').classList.add('active');
                document.getElementById('name').value = displayName;
            }
        });
    } else {
        window.location.href = 'index.html';
    }
};

// Mateirialize components
document.addEventListener('DOMContentLoaded', function() {
    var sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);
});