const accountDetails = document.querySelector('.account-details');

// Setup the user interface with info from auth/firestore
const setupUI = (user) => {
    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
            console.log(user);
            var name = (user.displayName) ? user.displayName : user.email;
            var photo = (user.photoURL) ? user.photoURL : 'img/noImg.svg';
            var email = user.email;
            const html = `
                <h6 class="center">Logged in as ${name}</h6><br />
                <div class="row">
                    <div class="col s12 m3"><img src="${photo}" class="circle responsive-img"></div>
                    <div class="col s12 m9">
                        <p><b>Display Name:</b> ${name}</p>
                        <p><b>Email:</b> ${email}</p>
                    </div>
                </div>
            `;
            accountDetails.innerHTML = html;
        });
    } else {
        alert('An error has occurred! You are not logged in and shouldn\'t being seeing this.');
    }
};

// Update account information
const updateAcct = document.querySelector('#update-acct');
updateAcct.addEventListener('click', (e) => {
    window.location.href = 'updateAcct.html';
});

// Mateirialize components
document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);
});