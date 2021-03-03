const {
    tableName,
    createDocument,
    getDocument,
    putDocument,
    deleteDocument,
    getAllDocuments
} = require('../../utils/connections_db/firebase-models');

const { response } = require('../../utils/properties');
const { groupsUserModel, plansGroupModel } = require('./groups.models');

const getGroups = (req, res) => {

    try {
        let route = tableName('groups');

        getAllDocuments(route, [
                ['type.id', '==', 1]
            ])
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

const getGroup = (req, res) => {
    try {
        let route = tableName(`groups/${req.params.groupID}`);

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

const createGroup = (req, res) => {

    let valide = groupsUserModel(req.body);

    if (valide.hasOwnProperty('errors')) {
        res.status(400)
            .json({
                'Error': valide.errors
            })
    } else {

        let route = tableName(`groups`);

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

const updateGroup = (req, res) => {

    let route = tableName(`groups`);

    try {
        putDocument(route, req.params.groupID, req.body)
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

const deleteGroup = (req, res) => {

    let route = tableName(`groups`);

    try {
        deleteDocument(route, req.params.groupID)
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


const getPlansGroups = (req, res) => {

    try {
        let route = tableName('groups/' + req.params.groupID + '/plans');

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

const getPlan = (req, res) => {
    try {
        let route = tableName(`groups/${req.params.groupID}/plans/${req.params.planID}`);

        getDocument(route)
            .then((response) => {
                res.json(response);
            })
            .catch(
                (error) => res.status(500).send()
            );
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
}

const createPlan = (req, res) => {


    let valide = plansGroupModel(req.body);

    if (valide.hasOwnProperty('errors')) {
        res.status(400)
            .json({
                'Error': valide.errors
            })
    } else {
        let route = tableName(`groups/${req.params.groupID}/plans`);

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

const updatePlan = (req, res) => {

    let route = tableName(`groups/${req.params.groupID}/plans`);

    try {
        putDocument(route, req.params.planID, req.body)
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

const deletePlan = (req, res) => {

    let route = tableName(`groups/${req.params.groupID}/plans`);

    try {
        deleteDocument(route, req.params.planID)
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

module.exports = {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getPlansGroups,
    getPlan,
    createPlan,
    updatePlan,
    deletePlan
}