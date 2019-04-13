const updateBtn = document.getElementById('update-acct');
const cancelBtn = document.getElementById('cancel-acct');
const uploader = document.getElementById('uploader');
const fileButton = document.getElementById('file-button');
const uploadStatus = document.getElementById('upload-status');

// Function to update user information
function updateUser(userInfo) {
    var user = firebase.auth().currentUser;
    user.updateProfile(userInfo).then(() => {
        return true;
    }).catch((err) => {
        alert('An error occurred updating your profile!\n' + err);
    });
}

// Function to validate file is an image
function imageCheck(img) {
    if (img.type.slice(0, img.type.indexOf('/')) !== 'image') {
        alert('Invalid image file!');
        return false;
    } else {
        return true;
    }
}

// Function to delete previous user image
function deleteImage() {
    var user = firebase.auth().currentUser;
    var oldPhotoExt = user.photoURL.substring(user.photoURL.lastIndexOf(".") + 1, user.photoURL.lastIndexOf("?"));
    var imgLocation = 'userImages/' + user.uid + '.' + oldPhotoExt;
    var storageRef = storage.ref(imgLocation);
    storageRef.getDownloadURL().then(
        // Old file found
        function(url) {
            // Delete previous image and remove reference to it
            storageRef.delete().then(() => {
                updateUser({photoURL: null});
                return true;
            }).catch((err) => {
                return err;
            });
        }
    ).catch((err) => {
        return err;
    });
}

// Function to upload new image
function uploadImage(photo) {
    console.log(photo);
    var user = firebase.auth().currentUser;
    // Create storage reference
    var storageRef = storage.ref('userImages/' + user.uid + '.' + photo.name.split('.').pop());
    // Adjust UI
    uploadStatus.style.display = 'initial';
    updateBtn.disabled = true;
    // Start upload task
    var task = storageRef.put(photo);
    task.on('state_changed', 
        function progress(snapshot) {
            // Show upload percentage
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.style.width = percentage + '%';
            document.getElementById('num-percent').innerHTML = Math.round(percentage) + '%';
        },
        function error(err) {
            document.getElementById('num-percent').innerHTML = err;
            alert('An error occurred uploading your image!\n' + err);
            return false;
        },
        function complete() {
            // Update UI
            updateBtn.disabled = false;
            task.snapshot.ref.getDownloadURL().then((downloadURL) => {
                document.getElementById('num-percent').classList.add('green-text');
                document.getElementById('num-percent').innerHTML = 'Upload Complete!';
                return downloadURL;
            });
        }
    );
}

// Update account event listener
updateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Get current user
    var user = firebase.auth().currentUser;

    // Set name to field value or null if blank
    var name = (document.getElementById('name').value) ? document.getElementById('name').value : null;
    // Set photo to file if one has been selected, null if empty
    var photo = (document.getElementById('file-button').files[0]) ? document.getElementById('file-button').files[0] : null;
    // If user already has a photo and no new file is selected, set photoURL to previous value
    if (user.photoURL && !photo) { photo = user.photoURL; }

    // If new file selected, delete previous photo (if needed), and upload new photo
    if (document.getElementById('file-button').files[0]) {
        // Validate that file is a photo
        if (imageCheck(document.getElementById('file-button').files[0])) {
            // File is a valid image, delete previous image if exists
            if (user.photoURL) {
                var imageStatus = deleteImage();
                // Check if previous image deleted
                if (!imageStatus) {
                    alert('An error occurred! Please check firebase console\'s storage to ensure everything is OK.\n' + imageStatus);
                }
            }
            // Upload new photo
            var uploadResult = uploadImage(photo);
            if (!uploadResult) {
                alert('An error occurred uploading your image!\n' + uploadResult);
            } else {
                photo = uploadResult;
            }
        }
    }
    // Update user
    var updatedUser = {displayName: name, photoURL: photo};
    if (updateUser(updatedUser)) {
        alert('Your profile has been updated!');
        window.location.href = 'main.html';
    } else {
        alert('Error(s) occurred updating your profile!');
        window.location.reload(true);
    }
        /*
        // Check if user has a previous photo and delete it
        if (user.photoURL) {
            var oldPhotoExt = user.photoURL.substring(user.photoURL.lastIndexOf(".") + 1, user.photoURL.lastIndexOf("?"));
            var imgLocation = 'userImages/' + user.uid + '.' + oldPhotoExt;
            var storageRef = storage.ref(imgLocation);
            storageRef.getDownloadURL().then(
                // Old file found
                function(url) {
                    // Delete previous photo and remove reference to it
                    storageRef.delete().then(() => {
                        user.updateProfile({
                            photoURL: null
                        }).then(
                            // Update image
                        ).catch((err) => {
                            console.log('An error occurred updating the photoURL.\n' + err);
                        });
                    }).catch((err) => {
                        console.log('An error occurred deleting the previous image.\n' + err);
                    });
                },
                function(err) {
                    console.log('Old file not found. Please check firebase console to assure everything is in order.\n' + err);
                }
            );
        } else {
            // Create storage reference
            storageRef = storage.ref('userImages/' + user.uid + '.' + photo.name.split('.').pop());
            // Upload file
            uploadStatus.style.display = 'initial';
            updateBtn.disabled = true;
            var task = storageRef.put(photo);
            task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploader.style.width = percentage + '%';
                document.getElementById('num-percent').innerHTML = Math.round(percentage) + '%';
            },
            function error(err) {
                document.getElementById('num-percent').innerHTML = err;
            },
            function complete() {
                updateBtn.disabled = false;
                task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    document.getElementById('num-percent').classList.add('green-text');
                    document.getElementById('num-percent').innerHTML = 'Upload Complete!';
                    user.updateProfile({
                        displayName: name,
                        photoURL: downloadURL
                    }).then(function() {
                        // Update successful.
                        alert('Account updated')
                        window.location.href = 'main.html';
                    }).catch(function(error) {
                        alert(error);
                    });
                });
            }
        );
        }
    }
    */

});

/*
// Update account event listener
updateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Get current user
    var user = firebase.auth().currentUser;

    // Get display name
    var name = (document.getElementById('name').value) ? document.getElementById('name').value : null;
    // Get image file
    var file = (document.getElementById('file-button').files[0]) ? document.getElementById('file-button').files[0] : null;
    // Create storage reference
    var storageRef = storage.ref('userImages/' + user.uid + '.' + file.name.split('.').pop());
    // Upload file
    uploadStatus.style.display = 'initial';
    updateBtn.disabled = true;
    var task = storageRef.put(file);
    task.on('state_changed', 
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.style.width = percentage + '%';
            document.getElementById('num-percent').innerHTML = Math.round(percentage) + '%';
        },
        function error(err) {
            document.getElementById('num-percent').innerHTML = err;
        },
        function complete() {
            updateBtn.disabled = false;
            task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                document.getElementById('num-percent').classList.add('green-text');
                document.getElementById('num-percent').innerHTML = 'Upload Complete!';
                user.updateProfile({
                    displayName: name,
                    photoURL: downloadURL
                }).then(function() {
                    // Update successful.
                    alert('Account updated')
                    window.location.href = 'main.html';
                }).catch(function(error) {
                    alert(error);
                });
            });
        }
    );
});
*/

// Cancel update event listener
cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'main.html';
});

// Setup the user interface with info from auth/firestore
const setupUI = (user) => {

    /* For testing storage right now
    var storageRef = storage.ref();
    var photo = storageRef.child('userPhoto.jpg');
    console.log(photo);
    */
    if (user) {
        db.collection('users').doc('user.uid').get().then(doc => {
            var email = user.email;
            var displayName = (user.displayName) ? user.displayName : '';
            var photoURL = (user.photoURL) ? user.photoURL : '';
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
        alert('An error has occurred! You are not logged in and shouldn\'t being seeing this.');
    }
};

// Mateirialize components
document.addEventListener('DOMContentLoaded', function() {
    var sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);
});