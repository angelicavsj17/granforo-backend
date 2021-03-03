const {
    tableName,
    createDocument,
    getDocument,
    putDocument
} = require('../../utils/connections_db/firebase-models');

const jwt = require('jsonwebtoken');
const {
    encrypt,
    decrypt,
    addMonth
} = require('../../utils/properties');
const { userModel, loginModel } = require('./users.models');


const saveUser = (data) => {
    return new Promise((resolve, reject) => {
        let route = tableName(`users`);

        try {
            createDocument(route, data)
                .then((response) => {
                    resolve(response);
                })
                .catch(
                    (error) => {
                        console.error(error);
                        resolve();
                    }
                );
        } catch (e) {
            console.error(e);
            resolve();
        }
    })
}

const createUser = (req, res) => {

    let valide = userModel(req.body);

    console.log(valide);

    if (valide.hasOwnProperty('errors')) {
        res.status(400)
            .json({
                'Error': valide.errors
            })
    } else {
        let data = valide;
        if (data.hasOwnProperty('email')) {
            let routeValid = tableName('users');

            getDocument(routeValid, [
                ['email', '==', data.email],
            ])
                .then((response) => {
                    if (response.length > 0) {
                        res.status(400)
                            .json({
                                'Error': ['Usuario ya existe']
                            });
                    } else {
                        if (data.hasOwnProperty('password')) {
                            hashPassword = encrypt(data.password);

                            data.password = hashPassword;
                        }

                        saveUser(data)
                            .then((response) => {
                                let keys = Object.keys(response);

                                if (keys.includes('password')) {
                                    delete response['password'];
                                }
                                res.status(201)
                                    .json(data);
                            })
                    }
                })
        }
    }
}


const generateToken = (user) => {

    let token = jwt.sign({
        'user': user,
        'refresh': 'vOVH6sdmpNWjRRIqCc7rdxsPlk1m'

    },
        'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3', {
        expiresIn: 1000 * 60 * 60 * 24 * 365
    }
    );

    return token;

}


const loginUser = (req, res) => {

    let valide = loginModel(req.body);

    if (valide.hasOwnProperty('errors')) {
        res.status(400)
            .json({
                'Error': valide.errors
            })
    } else {
        let data = valide;

        let params = [
            ['email', '==', data.email]
        ]

        let route = tableName('users');

        getDocument(route, params)
            .then((user) => {

                console.log(user)

                if (user.length === 0) {
                    res.status(400)
                        .json({
                            'Error': ['No se puede ingresar con las credenciales proporcionadas'],
                            'notFound': true
                        })
                } else {

                    if (user[0].active) {
                        if (user[0].social_media) {

                            var token = generateToken(user[0])

                            res.json({
                                'token': token
                            });


                        } else {

                            let decryptPassword = decrypt(user[0].password);

                            if (decryptPassword == data.password) {
                                delete user.password;

                                let token = generateToken(user[0]);

                                res.json({
                                    'token': token
                                });

                            } else {
                                res.status(400)
                                    .json({
                                        'Error': ['Contraseña Incorrecta']
                                    })
                            }
                        }
                    } else {
                        res.status(400)
                            .json({
                                'Error': ['Usuario No Activo']
                            })
                    }

                }
            })
    }
}

const updateUser = (req, res) => {

    console.log('Entro actualizar');

    let route = tableName('users');

    try {

        let data = req.body;

        if (data.hasOwnProperty('plan')) {


            let dateExpired = addMonth(new Date(), data.plan.duration);

            let date_created = new Date();

            data.plan.date_created = `${date_created.getFullYear()}-${date_created.getMonth() + 1}-${date_created.getDate() + 1}`;

            data.plan.date_expired = `${dateExpired.getFullYear()}-${dateExpired.getMonth() + 1}-${dateExpired.getDate() + 1}`;
        }

        console.log(data);

        putDocument(route, req.params.userID, data)
            .then((response) => {
                res.json(response);
            })
            .catch(
                (error) => {
                    console.error(error);
                    res.status(500).send();
                }
            );
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
}



const refreshToken = (req, res) => {

    if (req.params.refreshID == 'vOVH6sdmpNWjRRIqCc7rdxsPlk1m') {
        let route = tableName(`users/${req.params.userID}`);

        getDocument(route)
            .then((user) => {
                if (Object.keys(user).length > 0) {
                    delete user.password;

                    let token = jwt.sign({
                        'user': user[0],
                        'refresh': 'vOVH6sdmpNWjRRIqCc7rdxsPlk1m'

                    },
                        'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3', {
                        expiresIn: 60 * 60 * 24
                    }
                    );

                    res.json({
                        'token': token
                    });
                } else {
                    res.status(400)
                        .json({
                            'Error': ['User doesnt exists']
                        });
                }
            })
    } else {
        res.status(400)
            .json({
                'Error': ['Refresh invalid']
            });
    }
}

const getUser = (req, res) => {
    let token = req.get('Authorization');
    jwt.verify(
        token.substring(6),
        'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        (err, decoded) => {
            console.log(decoded, "this is decoded")
            let route = tableName(`users/${decoded.user.id}`);
            getDocument(route)
                .then(async (response) => {
                    let routeGroup = tableName(`groups/${response.group}`)
                    let group = await getDocument(routeGroup)
                    response.groupInfo = group
                    res.json(response);
                })
                .catch(
                    (error) => res.status(500).send()
                );
        }
    )
}

module.exports = {
    createUser,
    loginUser,
    refreshToken,
    updateUser,
    getUser
}