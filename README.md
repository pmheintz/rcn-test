# rcn-test
1. Create firebase project
    a. Log in to console.firebase.google.com with google account
    b. Click add project
    c. Give project a name (analytics not required)
2. Install node.js
3. Install firebase-tools from command line (npm install -g firebase-tools) or (sudo npm install -g firebase-tools)
3. From command line, (firebase login) to log in
4. Test that everything worked, (firebase list) should show the created project
5. Switch to the projects root directory
5. Initialize the project (firebase init)
    a. Select database and hosting

6. Initialize firebase functions (firebase init functions)
    a. Select javascript
    b. No to ESLint
    c. Install dependences select yes
