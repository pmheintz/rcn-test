const reauthBtn = document.getElementById('reauth-btn');
const uploadBtn = document.getElementById('upload-btn');
const deleteBtn = document.getElementById('remove-btn');
const fileCell = document.getElementById('file-cell');
const uploader = document.getElementById('uploader');
const uploadStatus = document.getElementById('upload-status');
let progressStatus = document.getElementById('num-percent');
let reauthFunction = 'password';
/**
 * Function to prompt user to re-authenticate
 */
const reauthPrompt = (err) => {
    let user = firebase.auth().currentUser;
    let emailField = document.getElementById('reauth-email');
    let emailLbl = document.getElementById('reauth-email-lbl');
    document.getElementById('reauth-header').innerHTML = err.message;
    emailField.value = user.email;
    emailLbl.classList.add('active');
    // Open login modal
    let elems = document.querySelector('.modal');
    let instance = M.Modal.init(elems);
    instance.open();
};

/**
 * Function to rea-uthenticate user
 */
const reauthenticate = () => {
    let user = firebase.auth().currentUser;
    let password = document.getElementById('reauth-password').value;
    let credential = firebase.auth.EmailAuthProvider.credential(
        user.email, 
        password
    );
    user.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
        switch (reauthFunction) {
            case 'email': {
                updateEmail();
                break;
            }
            case 'password': {
                updatePassword();
                break;
            }
            default: {
                alert('An error occurred! Unknown field to update.\nPlease report bug on RCN github site.');
                break;
            }
        }
        // Close modal
        let elems = document.querySelector('.modal');
        let instance = M.Modal.init(elems);
        instance.close();
    }).catch((err) => {
        let errorMessage = document.getElementById('reauth-header');
        errorMessage.innerHTML = err.message;
        errorMessage.classList.add('red-text');
    });
};

/**
 * Function to update display name
 * @param info Object containg display name
 */
const updateName = (info) => {
    // Get user to update
    let user = firebase.auth().currentUser;
    // Update display name
    user.updateProfile(info).then(() => {
        nameField.classList.remove('invalid');
        nameField.classList.add('valid');
        nameBtn.disabled = true;
    }).catch((err) => {
        // Get reference to name helper text
        let helperText = document.getElementById('name-helper-text');
        nameField.classList.remove('valid');
        nameField.classList.add('invalid');
        helperText.setAttribute('data-error', err.message);
    });
};

/**
 * Function to update the user's photo URL
 * @param url Object containing photo URL
 */
const updatePhotoURL = (url) => {
    // Get user to update
    let user = firebase.auth().currentUser;
    // Change message
    let status = (url.photoURL) ? 'Success!<br>New image reference set.' : 'Success!<br>Image and reference has been removed.';
    console.log('URL: ' + url.photoURL);
    // Update photo URL
    user.updateProfile(url).then(() => {
        uploader.style.width = '100%';
        document.getElementById('num-percent').classList.add('green-text');
        console.log('In updatePhotoURL: ' + status);
        progressStatus.innerHTML = status;
        //document.getElementById('photo-img').src = 'img/noImg.svg';
    }).catch((err) => {
        console.log('In updatePhotoURL: ' + err.message);
        progressStatus.innerHTML = 'Error: ' + err.message;
    });
};

/**
 * Function to delete user's profile image
 */
const deleteImage = () => {
    // Get current user
    let user = firebase.auth().currentUser; 

    if (user.photoURL) {
        // Get previous file extension
        let regex = /(?:\.([^.]+))?$/;
        let extension = regex.exec(user.photoURL)[1];
        let x = extension.indexOf('?');
        extension = extension.substring(0, x != -1 ? x : extension.length);

        // Create storage reference
        let storageRef = storage.ref('userImages/' + user.uid + '.' + extension);

        // Show status
        uploadStatus.style.display = 'initial';
        console.log('Deleting profile image...');
        progressStatus.innerHTML = 'Deleting profile image...';

        // Delete Image
        storageRef.delete().then(() => {
            uploader.style.width = '50%';
            console.log('Previous image deleted!<br>Removing image reference.');
            progressStatus.innerHTML = 'Previous image deleted!<br>Removing image reference.';
            updatePhotoURL({photoURL: null});
        }).catch((err) => {
            console.log('Error deleting image:<br>' + err.message);
            progressStatus.innerHTML = 'Error deleting image:<br>' + err.message;
        });
    } else {
        uploadStatus.style.display = 'initial';
        console.log('No previous photo found to delete.');
        progressStatus.innerHTML = 'No previous photo found to delete.';
    }
};

/**
 * Function to verify a file is an image
 * @param file The file to validate
 * @return boolean True if file is an image
 */
const verifyImage = (file) => {
    if (file.type.slice(0, file.type.indexOf('/')) === 'image') {
        return true;
    } else {
        return false;
    }
};

/**
 * Function to upload a new display image
 * @param photo File containing image to upload
 */
const uploadImage = (photo) => {
    // Get current user
    let user = firebase.auth().currentUser; 

    // Create storage reference
    let storageRef = storage.ref('userImages/' + user.uid + '.' + photo.name.split('.').pop());

    // Disable overlay while uploading
    uploadStatus.style.display = 'initial';
    let uiOverlay = document.getElementById('disable-ui');
    uiOverlay.style.display = 'block';

    // Create upload task
    let uploadTask = storageRef.put(photo);

    // Handle upload task
    uploadTask.on('state_changed',
        function progress (snapshot) {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.style.width = percentage + '%';
            progressStatus.innerHTML = Math.round(percentage) + '%';
        }, 
        function error (err) {
            progressStatus.innerHTML = err.message;
            uiOverlay.style.display = 'none';
        }, 
        function complete () {
            uiOverlay.style.display = 'none';
            uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
                progressStatus.classList.add('green-text');
                progressStatus.innerHTML = 'Image uploaded!';
                document.getElementById('profile-img').src = downloadUrl;
                updatePhotoURL({photoURL: downloadUrl});
            }).catch((err) => {
                progressStatus.classList.remove('green-text');
                progressStatus.classList.add('red-text');
                progressStatus.innerHTML = err.message;
            });
        }
    );
};

/**
 * Function to update the user's email
 */
const updateEmail = () => {
    // Get user to update
    let user = firebase.auth().currentUser;
    // Get result text reference
    let resultText = document.getElementById('email-conf-helper-text');
    // Attempt to update email address
    user.updateEmail(emailField.value).then(() => {
        resultText.setAttribute('data-success', 'Email address successfully updated!');
        emailConfField.classList.remove('invalid');
        emailConfField.classList.add('valid');
        emailBtn.disabled = true;
    }).catch((err) => {
        resultText.setAttribute('data-error', err.message);
        emailConfField.classList.remove('valid');
        emailConfField.classList.add('invalid');
        // Check if re-authentication is needed
        if (err.code === 'auth/requires-recent-login') {
            reauthFunction = 'email';
            reauthPrompt(err);
        } else {
            alert('The following error occurred updating your email:\n' + err.message);
        }
    });
};

/**
 * Function to update password
 */
const updatePassword = () => {
    // Get user to update
    let user = firebase.auth().currentUser;
    // Get result text reference
    let resultText = document.getElementById('password-conf-helper-text');
    // Attempt to update password
    user.updatePassword(passwordField.value).then(() => {
        resultText.setAttribute('data-success', 'Password successfully updated!');
        passwordConfField.classList.remove('invalid');
        passwordConfField.classList.add('valid');
        passwordBtn.disabled = true;
    }).catch((err) => {
        resultText.setAttribute('data-error', err.message);
        passwordConfField.classList.remove('valid');
        passwordConfField.classList.add('invalid');
        // Check if error is because re-authentication is needed
        if (err.code === 'auth/requires-recent-login') {
            reauthFunction = 'password';
            reauthPrompt(err);
        } else {
            alert('The following error occurred updating your password:\n' + err.message);
        }
    });
};

// Delete image button event listener
deleteBtn.addEventListener('click', () => {
    deleteImage();
});

// Upload image button event listener
uploadBtn.addEventListener('click', () => {
    // Get the file to upload
    let photo = (document.getElementById('file-button').files[0]) ? document.getElementById('file-button').files[0] : null;
    
    // Check if file is selected
    if (photo) {
        // Verify file is an image
        if (verifyImage(photo)) {
            // File is an image, delete previous image/reference if there
            if (firebase.auth().currentUser.photoURL) {
                deleteImage();
            }
            uploadImage(photo);
        } else {
            uploadStatus.style.display = 'initial';
            progressStatus.classList.remove('green-text');
            progressStatus.classList.add('red-text');
            progressStatus.innerHTML = 'Selected file is not an acceptable image.<br>Please try a jpeg, bmp, gif, png, or webp.';
        }
    } else {
        alert('No file selected!\nPlease click "file" button and select an image.');
    }
});

// Re-authenticate button event listener
reauthBtn.addEventListener('click', () => {
    reauthenticate();
});

// File select event listener
fileCell.addEventListener('click', () => {
    uploadStatus.style.display = 'none';
});

// Update email event listener
emailBtn.addEventListener('click', () => {
    updateEmail();
});

// Update password event listener
passwordBtn.addEventListener('click', () => {
    updatePassword();
});

// Update name event listener
nameBtn.addEventListener('click', () => {
    // Get new display name
    let name = nameField.value;
    updateName({displayName: name});
});