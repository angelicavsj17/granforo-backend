const jwt = require('jsonwebtoken');

const {
    getDocument,
    tableName
} = require('../connections_db/firebase-models');


const permit = (...permittedRoles) => {
    return (req, res, next) => {

        let token = req.get('Authorization');

        if (!token) {
            res.status(401);
            res.json({
                'Error': ['Authentication is required']
            })
        } else {
            if (token.substring(0, 5) != 'Token') {
                res.status(401)
                    .json({
                        'Error': ['Token is required']
                    })
            }
        }
        if (token) {
            jwt.verify(
                token.substring(6),
                'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
                (err, decoded) => {
                    if (err) {
                        res.status(401)
                            .json({
                                'Error': [
                                    'Invalid Token'
                                ]
                            })
                    } else {
                        user = decoded.user;

                        req.user = user;
                        let route = tableName(`groups/${user.group}`);

                        getDocument(route)
                            .then((response) => {
                                if (permittedRoles.includes(response.name)) {
                                    next();
                                } else {
                                    res.status(403)
                                        .json({
                                            'Error': [
                                                'You haven"t permissions for this action'
                                            ]
                                        });
                                }
                            });
                    }
                })
        }

    }
}

module.exports = {
    permit
}