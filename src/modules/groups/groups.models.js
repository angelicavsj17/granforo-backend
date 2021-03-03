const valide = require('../../utils/validations');


const groupsUserModel = (data) => {

    const model = {
        name: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        type: {
            defineType: 'object',
            validators: {
                required: false,
                default: {
                    description: 'is staff',
                    id: 1
                }
            }
        }
    }

    let instance = new valide(data, model);

    return instance.resultGet;
}

const plansGroupModel = (data) => {

    const model = {
        duration: {
            defineType: 'number',
            validators: {
                required: true
            }
        },
        name: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
        description: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
        cost: {
            defineType: 'string',
            validators: {
                required: false
            }
        }
    }

    let instance = new valide(data, model);

    return instance.resultGet;
}

module.exports = {
    groupsUserModel,
    plansGroupModel
}