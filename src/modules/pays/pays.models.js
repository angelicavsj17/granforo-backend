const valide = require("../../utils/validations");

const payModel = (data) => {
  let model = {
    number: {
      defineType: "string",
      validators: { required: true },
    },
    securityCode: {
      defineType: "string",
      validators: { required: true },
    },
    expirationDate: {
      defineType: "string",
      validators: { required: true },
    },
    name: {
      defineType: "string",
      validators: { required: true },
    },
    paymentMethod: {
      defineType: "string",
      validators: { required: true },
    },
  };

  let instance = new valide(data, model);

  return instance.resultGet;
};

module.exports = {
  payModel,
};
