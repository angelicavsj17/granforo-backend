const sha256 = require("js-sha256").sha256;
const uniqid = require("uniqid");
const merge = require("../../utils/deepMerge");
const axios = require("axios");
const test = true;
const [urlPayulatam, apiKey, apiLogin, merchantId] = test
    ? [
        "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi",
        "4Vj8eK4rloUd272L48hsrarnUA",
        "pRRXKOl8ikMmt9u",
        508029,
    ]
    : [
        "https://api.payulatam.com/payments-api/4.0/service.cgi",
        "119cffeb729",
        "NWYN24hw8jpF9z7",
        23457,
    ];
const state = "APPROVED";

const dataBase = {
    language: "es",
    command: "SUBMIT_TRANSACTION",
    merchant: {
        apiLogin,
        apiKey,
    },
    transaction: {
        order: {
            accountId: "512321",
            referenceCode: null,
            description: null,
            language: "es",
            signature: null,
            additionalValues: {
                TX_VALUE: {
                    value: null,
                    currency: null,
                },
            },
        },
        creditCard: {
            number: null,
            securityCode: null,
            expirationDate: null,
            name: null,
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod: null,
        paymentCountry: "CO",
        payer: {
            fullName: null,
            emailAddress: null,
        },
        extraParameters: {},
    },
    test,
};

const setSignature = (data) => {
    if (
        data &&
        data.transaction &&
        data.transaction.order &&
        data.transaction.order.referenceCode &&
        data.transaction.order.additionalValues &&
        data.transaction.order.additionalValues.TX_VALUE &&
        data.transaction.order.additionalValues.TX_VALUE.value &&
        data.transaction.order.additionalValues.TX_VALUE.currency
    ) {
        const {
            referenceCode,
            additionalValues: {
                TX_VALUE: { value: tx_value, currency },
            },
        } = data.transaction.order;
        const message = `${apiKey}~${merchantId}~${referenceCode}~${tx_value}~${currency}`;
        data.transaction.order.signature = sha256(message);
    }
};

const getDataRequest = (user, body, cost, currency) => {
    if (user && body) {
        const { paymentMethod, name, number, ...creditCard } = body;
        const dataClient = {
            transaction: {
                order: {
                    referenceCode: uniqid(),
                    description: 'Payment',
                    additionalValues: {
                        TX_VALUE: {
                            value: Number(cost),
                            currency: currency
                        },
                    },
                },
                creditCard: {
                    ...creditCard,
                    name: test ? state : name,
                    number: Number(String(number).replace(/\D/g, "")),
                },
                paymentMethod,
                payer: {
                    fullName: test ? state : user.fullName,
                    emailAddress: user.email,
                },
            },
        };
        const data = merge(dataBase, dataClient);
        setSignature(data);

        return data;
    }

    return null;
};

module.exports = async (user, body, cost, currency) => {
    console.log(cost, currency, 'this is the cost')
    try {
        const data = getDataRequest(user, body, cost, currency);
        if (data) {
            const response = await axios({
                method: "post",
                url: urlPayulatam,
                headers: {
                    "Content-Type": "application/json",
                },
                data,
            });
            if (response && response.data) {
                return response.data;
            }
            else throw Error("There was no response");
        }
        else throw Error("Error creating data for PayU API");
    }
    catch (err) {
        return {
            code: "ERROR",
            error: String(err),
            transactionResponse: null,
        };
    }
};
