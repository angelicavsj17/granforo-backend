const { modelEvents, countryModel, typeModel } = require('./events.models');
const {
    tableName,
    createDocument,
    getDocument,
    putDocument,
    deleteDocument,
    getAllDocuments,
    getDocumentsById
} = require('../../utils/connections_db/firebase-models');

const { v1: uuidv1 } = require('uuid');
const { response } = require('../../utils/properties');
const { verify } = require('../../utils/google/auth');
const jwt = require('jsonwebtoken');
const { createChannel, deleteChannel } = require('../../utils/aws/ivs');
const { sendMail, hostname } = require('../../utils/mails');


const getEvents = (req, res) => {

    try {
        let route = tableName('events');

        getAllDocuments(route)
            .then((data) => {

                if (data) {
                    res.json(response(data));
                } else {
                    res.status(400).send();
                }
            })
            .catch(
                (error) => res.status(500).send()
            );

    } catch (error) {
        res.status(500).send();
    }
}

const getEvent = (req, res) => {
    try {
        let route = tableName(`events/${req.params.eventID}`);

        getDocument(route)
            .then((response) => {
                res.json(response);
            })
            .catch(
                (error) => res.status(500).send()
            );
    } catch (e) {
        res.status(500).send()
    }
}

const queryEvents = (req, res) => {
    try {
        let route = tableName('events');
        getAllDocuments(route, req.body.filters, req.body.orderBy, req.body.limit, req.body.searchFiltered)
            .then((data) => {
                if (data) {
                    res.json(response(data));
                } else {
                    res.status(400).send();
                }
            })
            .catch(
                (error) => res.status(500).send()
            );

    } catch (error) {
        res.status(500).send();
    }
}

const createEvent = (req, res) => {
    let token = req.get('Authorization');
    jwt.verify(
        token.substring(6),
        'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        (err, decoded) => {
            req.body.userId = decoded.user.id;
            let valide = modelEvents(req.body);
            if (valide.hasOwnProperty('errors')) {
                res.status(201)
                    .json({
                        'Error': valide.errors
                    })
            } else {
                let route = tableName(`events`);
                let obj = {}
                Object.entries(valide).forEach(([key, value]) => {
                    if (typeof value === 'object') {
                        if (value.length > 0) {
                            obj[key] = value
                        }
                        else if (value.length === undefined) {
                            let o = {}
                            Object.entries(value).forEach(([key, value]) => {
                                if (value && key) {
                                    o[key] = value
                                }
                            })
                            obj[key] = o
                        }
                    }
                    else {
                        if (value) {
                            obj[key] = value
                        }
                    }
                })
                try {
                    createDocument(route, obj)
                        .then((response) => {
                            valide.products.map((product) => {
                                let ecommerceRoute = tableName('ecommerce')
                                createDocument(ecommerceRoute, { ...product, img: '', event: response.id })
                            })
                            sendMail({
                                to: decoded.user.email, subject: 'Evento creado', name: 'createEvent', params: {
                                    name: valide.name,
                                    description: valide.description,
                                    link: hostname + 'event/' + response.id,
                                }
                            })
                            // res.status(500)
                            res.json(response);
                        })
                        .catch(
                            (error) => {
                                console.error(error);
                                res.status(500).send()
                            }
                        );
                } catch (e) {
                    console.error(e);
                    res.status(500).send();
                }
            }
        })

}

let createStream = (req, res) => {
    let { eventID } = req.params
    createChannel({ name: eventID }).then(({ streamingUtils }) => {
        let route = tableName(`events`);
        putDocument(route, req.params.eventID, { ...streamingUtils }).then((response) => {
            res.json(response)
        }).catch(
            (error) => {
                console.error(error);
                res.status(500).send()
            }
        );
    })
}

const deleteStream = (req, res) => {
    let { eventID } = req.params
    let route = tableName(`events/${eventID}`);
    let route2 = tableName(`events`);
    getDocument(route).then((response) => {
        deleteChannel({ arn: response.channelArn }).then((response) => {
            putDocument(route2, eventID, { videoUrl: null, channelArn: null, key: null, rtmp: null }).then((response) => {
                res.json(response)
            }).catch(
                (error) => {
                    console.error(error);
                    res.status(500).send()
                }
            );
        }).catch(
            (error) => {
                res.status(500).send()
            }
        );
    }).catch(
        (error) => {
            res.status(500).send()
        }
    );
}

const updateEvent = (req, res) => {

    let route = tableName('events');
    try {
        putDocument(route, req.params.eventID, req.body)
            .then((response) => {
                res.json(response);
            })
            .catch(
                (error) => {
                    console.error(error);
                    res.status(500).send()
                }
            );
    } catch (e) {
        res.status(500).send();
    }

}

const deleteEvent = (req, res) => {

    let route = tableName(`events`);

    try {
        deleteDocument(route, req.params.eventID)
            .then(() => {
                res.status(204).send();
            })
            .catch(
                (error) => {
                    console.error(error);
                    res.status(500).send()
                }
            );
    } catch (e) {
        res.status(500).send();
    }
}

let getMostSeenEvents = async (req, res) => {
    let ids = await verify(["ga:dimension1"], ['ga:metric1'], 10, '30daysAgo', 'today', '', "-ga:metric1");
    let idsList = [];
    for (let id of ids) {
        idsList.push(id[0]);
    }
    let route = tableName(`events`);
    getDocumentsById(route, idsList)
        .then((data) => {
            if (data) {
                res.json(response(data));
            } else {
                res.status(400).send({});
            }
        })
        .catch(
            (error) => { console.log(error); res.status(500).send() }
        );
}



const getCountries = (req, res) => {

    try {
        let route = tableName('countries');

        getAllDocuments(route)
            .then((data) => {

                if (data) {
                    res.json(response(data));
                } else {
                    res.status(400).send();
                }
            })
            .catch(
                (error) => res.status(500).send()
            );

    } catch (error) {
        res.status(500).send();
    }
}

const getCountry = (req, res) => {
    try {
        let route = tableName(`countries/${req.params.countryID}`);

        getDocument(route)
            .then((response) => {
                res.json(response);
            })
            .catch(
                (error) => res.status(500).send()
            );
    } catch (e) {
        res.status(500).send()
    }
}

const createCountry = (req, res) => {

    let valide = countryModel(req.body);

    if (valide.hasOwnProperty('errors')) {
        res.status(400)
            .json({
                'Error': valide.errors
            })
    } else {
        let route = tableName(`countries`);

        try {
            createDocument(route, valide)
                .then((response) => {
                    res.json(response);
                })
                .catch(
                    (error) => {
                        console.error(error);
                        res.status(500).send()
                    }
                );
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    }
}

const updateCountry = (req, res) => {

    let route = tableName('countries');


    try {
        putDocument(route, req.params.countryID, req.body)
            .then((response) => {
                res.json(response);
            })
            .catch(
                (error) => {
                    console.error(error);
                    res.status(500).send()
                }
            );
    } catch (e) {
        res.status(500).send();
    }

}

const deleteCountry = (req, res) => {

    let route = tableName(`countries`);

    try {
        deleteDocument(route, req.params.countryID)
            .then(() => {
                res.status(204).send();
            })
            .catch(
                (error) => {
                    console.error(error);
                    res.status(500).send()
                }
            );
    } catch (e) {
        res.status(500).send();
    }
}


const getTypes = (req, res) => {

    try {
        let route = tableName('type_events');

        getAllDocuments(route)
            .then((data) => {

                if (data) {
                    res.json(response(data));
                } else {
                    res.status(400).send();
                }
            })
            .catch(
                (error) => res.status(500).send()
            );

    } catch (error) {
        res.status(500).send();
    }
}

const getType = (req, res) => {
    try {
        let route = tableName(`type_events/${req.params.typeID}`);

        getDocument(route)
            .then((response) => {
                res.json(response);
            })
            .catch(
                (error) => res.status(500).send()
            );
    } catch (e) {
        res.status(500).send()
    }
}

const createType = (req, res) => {

    let valide = typeModel(req.body);

    if (valide.hasOwnProperty('errors')) {
        res.status(400)
            .json({
                'Error': valide.errors
            })
    } else {
        let route = tableName(`type_events`);

        try {
            createDocument(route, valide)
                .then((response) => {
                    res.json(response);
                })
                .catch(
                    (error) => {
                        console.error(error);
                        res.status(500).send()
                    }
                );
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    }
}

const updateType = (req, res) => {

    let route = tableName('type_events');


    try {
        putDocument(route, req.params.countryID, req.body)
            .then((response) => {
                res.json(response);
            })
            .catch(
                (error) => {
                    console.error(error);
                    res.status(500).send()
                }
            );
    } catch (e) {
        res.status(500).send();
    }

}

const deleteType = (req, res) => {

    let route = tableName(`type_events`);

    try {
        deleteDocument(route, req.params.countryID)
            .then(() => {
                res.status(204).send();
            })
            .catch(
                (error) => {
                    console.error(error);
                    res.status(500).send()
                }
            );
    } catch (e) {
        res.status(500).send();
    }
}

let getAllMyCreatedEvents = (req, res) => {
    let token = req.get('Authorization');
    jwt.verify(
        token.substring(6),
        'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        (err, decoded) => {
            let route = tableName('events')
            getAllDocuments(route, [['userId', '==', decoded.user.id]]).then((data) => {
                res.json(data)
            })
        }
    )
}

let getMyEvents = (req, res) => {
    let token = req.get('Authorization');
    jwt.verify(
        token.substring(6),
        'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        (err, decoded) => {
            if (!err) {
                // res.json({ decoded })
                let route = tableName('payments')
                getAllDocuments(route, [['user', '==', decoded.user.id]]).then((data) => {
                    let idsList = [];
                    for (let id of data) {
                        idsList.push(id.event);
                    }
                    let route = tableName('events')
                    getDocumentsById(route, idsList).then((data) => {
                        res.json(data)
                    }).catch(() => { res.json([]) })
                })
            }
        })
}

let getProducts = (req, res) => {
    let { eventId } = req.params;
    let route = tableName('ecommerce')
    console.log(eventId, 'eventid')
    getAllDocuments(route, [['event', '==', eventId]]).then((ecommerce) => {
        res.json(ecommerce)
    }).catch(() => { res.status(500, 'Event not found') })
}

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    createStream,
    queryEvents,
    getMostSeenEvents,
    getCountries,
    getCountry,
    createCountry,
    updateCountry,
    deleteCountry,
    getTypes,
    getType,
    createType,
    updateType,
    deleteType,
    deleteStream,
    getMyEvents,
    getProducts,
    getAllMyCreatedEvents
}