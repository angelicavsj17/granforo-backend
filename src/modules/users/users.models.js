const valide = require('../../utils/validations');

const userModel = (data) => {
    let model = {
        fullName: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
        email: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        password: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
        group: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        plan: {
            defineType: 'object',
            validators: {
                required: false,
                default: { }
            }
        },
        active: {
            defineType: 'bool',
            validators: {
                required: false,
                default: false
            }
        },
        social_media: {
            defineType: 'bool',
            validators: {
                required: false
            }
        }
    }

    let instance = new valide(data, model);

    return instance.resultGet;
}

const loginModel = (data) => {

    let model = {
        email: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        password: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
    }

    let instance = new valide(data, model);

    return instance.resultGet;
}

module.exports = {
    userModel,
    loginModel
}