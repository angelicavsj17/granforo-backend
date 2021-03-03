const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://react-app-novoclick.firebaseio.com"
});

const db = admin.firestore();

module.exports = {
    db
}