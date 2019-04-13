const updateBtn = document.getElementById('update-acct');
const cancelBtn = document.getElementById('cancel-acct');
const uploader = document.getElementById('uploader');
const fileButton = document.getElementById('file-button');
const uploadStatus = document.getElementById('upload-status');

/*
// File selection event listener
fileButton.addEventListener('change', (e) => {
    // Get the file
    var file = e.target.files[0];

    // Create storage reference
    var storageRef = storage.ref('userImages/' + file.name);

    // Upload file
    uploadStatus.style.display = 'initial';
    updateBtn.disabled = true;
    var task = storageRef.put(file);

    // Update progress bar
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
            document.getElementById('num-percent').classList.add('green-text');
            document.getElementById('num-percent').innerHTML = 'Upload Complete!';
        }
    );
});
*/

// Update account event listener
updateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Get current user
    var user = firebase.auth().currentUser;

    // Check for changes
    var name = (document.getElementById('name').value) ? document.getElementById('name').value : null;
    var photo = (document.getElementById('file-button').files[0]) ? document.getElementById('file-button').files[0] : null;
    if (user.photoURL && !photo) { photo = user.photoURL; }

    // Update account with photo or update account
    if (document.getElementById('file-button').files[0]) {
        // Validate that file is a photo
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
        /*
        // Delete previous photo
        var oldPhotoExt = user.photoURL.substring(user.photoURL.lastIndexOf(".") + 1, user.photoURL.lastIndexOf("?"));
        var storageRef = storage.ref('userImages/' + user.uid + '.' + oldPhotoExt);
        storageRef.delete().then(() => {
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
        }).catch((err) => {
            alert(err);
        });
        */
    }

});

function testFunction() {
    alert('this works!');
}

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
            console.log(email + '\n' + displayName + '\n' + photoURL);
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