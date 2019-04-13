const updateBtn = document.getElementById('update-acct');
const cancelBtn = document.getElementById('cancel-acct');
const uploader = document.getElementById('uploader');
const fileButton = document.getElementById('file-button');
const uploadStatus = document.getElementById('upload-status');
var errors = [];

// Function to update user info
// @param user - the user to update
// @param info - an object with the new user info
// return true if updated, false if failed
function updateUser(user, info) {
    user.updateProfile(info).then().catch((err) => {
        errors.push(err);
        return false;
    });
}

// Function to verify file is an image
// @param file - file to check
// returns true if image, false if not
function verifyImage(file) {
    if (file.type.slice(0, file.type.indexOf('/')) === 'image') {
        return true;
    } else {
        errors.push(err);
        return false;
    }
}

// Function to delete user's profile image
// @param user -the user whos image will be deleted
// returns true if deleted, false if an error
function deleteImage(user) {
    // Get previous file extension
    var regex = /(?:\.([^.]+))?$/;
    var extension = regex.exec(user.photoURL)[1];
    var x = extension.indexOf('?');
    extension = extension.substring(0, x != -1 ? x : extension.length);

    // Create storage reference
    var storageRef = storage.ref('userImages/' + user.uid + '.' + extension);

    // Delete Image
    storageRef.delete().then(() => {
        // Remove photo URL from user info
        updateUser(user, {photoURL: null});
        return true;
    }).catch((err) => {
        errors.push(err);
        return false;
    });
}

// Function to upload a new image
function uploadImage(user, photo) {
    // Create storage reference
    var storageRef = storage.ref('userImages/' + user.uid + '.' + photo.name.split('.').pop());

    // Disable UI while uploading
    uploadStatus.style.display = 'initial';
    updateBtn.disabled = true;

    // Create upload task
    var uploadTask = storageRef.put(photo);

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
            return;
        }, 
        function complete() {
            updateBtn.disabled = false;
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                document.getElementById('num-percent').classList.add('green-text');
                document.getElementById('num-percent').innerHTML = 'Upload Complete!';
                if (updateUser(user, {photoURL: downloadURL})) {
                    return true;
                }
            });
        }
    );
    console.log('storageRef' + storageRef);
}

// Update profile event listener
updateBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Get current user
    var user = firebase.auth().currentUser;

    // Get display name variable
    var name = (document.getElementById('name').value) ? document.getElementById('name').value : null;
    console.log('Name will be ' + name);

    // Check for new profile image
    if (document.getElementById('file-button').files[0]) {
        // Check if previous photo exists
        if (user.photoURL) {
            // Old photo there, delete it
            console.log('Old photo found, attempting to delete.');
            deleteImage(user);
        }
        // Verify new file is image
        if (verifyImage(document.getElementById('file-button').files[0])) {
            // File is an image, upload it
            uploadImage(user, document.getElementById('file-button').files[0]);
        }
    }

    // Update display name
    updateUser(user, {displayName: name});

    /* This causes the code to perform incorrectly. This will execute befor firebase async tasks complete preventing proper updating.
    /* Posible solution is to create a promise?
    // Report errors
    if (errors.length !== 0) {
        errors.forEach((error) => {
            alert('An error occurred updating your profile: \n' + error);
        });
    } else {
        alert('Profile successfully updated!');
        window.location.href ='main.html';
    }
    */
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
            var email = currentUser.email;
            var displayName = (currentUser.displayName) ? currentUser.displayName : '';
            var photoURL = (currentUser.photoURL) ? currentUser.photoURL : '';
            if (email) {
                // Add active class to prevent overlapping with materialize
                document.getElementById('email-lbl').classList.add('active');
                var emailField = document.getElementById('email');
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