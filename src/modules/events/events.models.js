const valide = require('../../utils/validations');

const modelEvents = (data) => {

    let model = {
        name: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        image: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        projectImages: {
            defineType: 'array',
            validators: {
                required: false
            }
        },
        noPanelistas: {
            defineType: 'number',
            validators: {
                required: true
            }
        },
        typeEvent: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        urlWeb: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
        country: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        accountSocial: {
            defineType: 'array',
            validators: {
                required: true
            }
        },
        cost: {
            defineType: 'number',
            validators: {
                required: false
            }
        },
        dateCreated: {
            defineType: 'number',
            validators: {
                required: true,
                default: new Date() // Hora del evento
            }
        },
        dayEventFrom: {
            defineType: 'number',
            validators: {
                required: true
            }
        },
        dayEventUntil: {
            defineType: 'number',
            validators: {
                required: true
            }
        },
        timeEventFrom: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        timeEventUntil: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        noTickets: {
            defineType: 'number',
            validators: {
                required: true
            }
        },
        description: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        chatRoom: {
            defineType: 'bool',
            validators: {
                required: false
            }
        },
        remember: {
            defineType: 'bool',
            validators: {
                required: false
            }
        },
        support: {
            defineType: 'bool',
            validators: {
                required: false
            }
        },
        userId: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        products: {
            defineType: 'array',
            validators: {
                required: true
            }
        },
        media: {
            defineType: 'object',
            validators: {
                required: false
            }
        },
        coin: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
        director: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        rtmp: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
        key: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
        videoUrl: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
        channelArn: {
            defineType: 'string',
            validators: {
                required: false
            }
        },
    }

    let instance = new valide(data, model);

    return instance.resultGet;
}

const countryModel = (data) => {
    let model = {
        name: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        flag: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        collingCodes: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
    }

    let instance = new valide(data, model);

    return instance.resultGet;
}


const typeModel = (data) => {
    let model = {
        name: {
            defineType: 'string',
            validators: {
                required: true
            }
        },
        description: {
            defineType: 'string',
            validators: {
                required: true
            }
        }
    }

    let instance = new valide(data, model);

    return instance.resultGet;
}

module.exports = {
    modelEvents,
    countryModel,
    typeModel
}