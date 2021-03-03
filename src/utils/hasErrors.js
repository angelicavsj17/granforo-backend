const { validationResult } = require('express-validator')
const hasErrors = (req, res, next) => {
    let result = validationResult(req);
    if (result.isEmpty()) {
        next()
    }
    else {
        res.json({ error: true, errors: result.array() })
    }
}
module.exports = hasErrors