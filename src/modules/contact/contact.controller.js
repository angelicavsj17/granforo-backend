const { tableName, createDocument } = require("../../utils/connections_db/firebase-models")

const postContact = (req, res) => {
    let route = tableName('contact');
    createDocument(route, req.body).then((data) => {
        res.json({ data })
    }).catch(() => { res.status(500) })
}

module.exports = {
    postContact
}