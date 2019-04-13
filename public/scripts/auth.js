// Listen for auth state change
auth.onAuthStateChanged(user => {
    if (user) {
        // Change this. I think there's a better way to do this
        document.getElementById('main-body').style.display = "initial";
        setupUI(user);
    } else {
        window.location.href = 'index.html';
    }
});

// Log out
const logout = document.querySelector('#logout');
const logoutSide = document.querySelector('#logout-side');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    window.location.href = 'index.html';
});
logoutSide.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    window.location.href = 'index.html';
});