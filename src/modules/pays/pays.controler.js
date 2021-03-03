const {
  tableName,
  getDocument,
  createDocument,
  getAllDocuments,
} = require("../../utils/connections_db/firebase-models");
const { sendMail, hostname } = require("../../utils/mails");
const connectionPayU = require("./connectionPayU");
const connectionPayUTicket = require("./connectionPayUTicket");
const { payModel } = require("./pays.models");
const { v1: uuidv1 } = require('uuid');

const createPay = async (req, res) => {
  try {
    const body = payModel(req.body);

    if (body.hasOwnProperty("errors") || !req.params || !req.params.userId) {
      res.status(400).send(body.errors);
      return;
    } else {
      let route = tableName(`users/${req.params.userId}`);
      const user = await getDocument(route);
      // user.plan = { name: "Super test", cost: "$50.000" };

      if (!user || !user.plan || !user.plan.cost) {
        res.status(400).send("User invalid");
        return;
      }
      const response = await connectionPayU(user, body);
      console.debug(body);
      // console.debug("response", response);
      if (response) {
        if (
          response.code === "SUCCESS" &&
          !response.error &&
          response.transactionResponse &&
          response.transactionResponse.state
        ) {
          const code =
            response.transactionResponse.state === "APPROVED" ? 201 : 406;
          res.status(code).json(response.transactionResponse);
          return;
        } else if (response.code === "ERROR" && response.error)
          throw Error(String(response.error));
        else throw Error("Wrong answer");
      }
    }
  } catch (err) {
    res.status(500).send(String(err));
    return;
  }

  res.status(500).send("Something went wrong");
};

const createPayTicket = async (req, res) => {
  try {
    let route2 = tableName(`events/${req.params.eventId}`);
    const event = await getDocument(route2);
    if (event.cost > 0) {
      const body = payModel(req.body);
      if (body.hasOwnProperty("errors") || !req.params || !req.params.userId) {
        return res.status(400).send(body.errors);
      }
      else {
        let route = tableName(`users/${req.params.userId}`);
        const user = await getDocument(route);
        if (!user || !event) {
          return res.status(400).send("User invalid");
        }
        const response = await connectionPayUTicket(user, body, event.cost, event.coin);
        if (response) {
          if (
            response.code === "SUCCESS" &&
            !response.error &&
            response.transactionResponse &&
            response.transactionResponse.state
          ) {
            const code =
              response.transactionResponse.state === "APPROVED" ? 201 : 406;
            let route = tableName('payments')
            if (code === 201) {
              createDocument(route, { user: req.params.userId, event: req.params.eventId })
              sendMail({
                to: user.email, subject: 'Ticket comprado', name: 'ticket', params: {
                  name: event.name,
                  description: event.description,
                  link: hostname + 'ticket/' + event.id,
                  indications: `Podras entrar al evento en la hora y fecha indicada`
                }
              })
            }
            return res.status(code).json(response.transactionResponse);
          } else if (response.code === "ERROR" && response.error)
            throw Error(String(response.error));
          else throw Error("Wrong answer");
        }
      }
    }
    else {
      let route = tableName(`users/${req.params.userId}`);
      const user = await getDocument(route);
      if (user) {
        sendMail({
          to: user.email, subject: 'Ticket obtenido', name: 'ticket', params: {
            name: event.name,
            description: event.description,
            link: hostname + 'ticket/' + event.id,
            indications: `Podras entrar al evento en la hora y fecha indicada`
          }
        })
        let route = tableName('payments')
        createDocument(route, { user: req.params.userId, event: req.params.eventId }).then(() => {
          return res.json({ success: true })
        })
      }
      else {
        console.log('throwing error')
        throw Error("User error")
      }
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send(String(err));
  }
};

const getPayments = (req, res) => {
  let { id } = req.params
  let route = tableName(`payments`)
  getAllDocuments(route, [['event', '==', id]]).then((data) => {
    res.json(data)
  }).catch(() => {
    res.status(500, 'Not found')
  })
}

const buyProduct = (req, res) => {
  let { userId, color, size, productId } = req.params;
  try {
    let routeEcommerce = tableName(`ecommerce/${productId}`)
    getDocument(routeEcommerce).then(async (product) => {
      const body = payModel(req.body);
      if (body.hasOwnProperty("errors") || !userId) {
        return res.status(400).send(body.errors);
      }
      else {
        let route = tableName(`users/${userId}`);
        const user = await getDocument(route);
        if (!user) {
          return res.status(400).send("User invalid");
        }
        const response = await connectionPayUTicket(user, body, product.price, product.coin);
        if (response) {
          if (
            response.code === "SUCCESS" &&
            !response.error &&
            response.transactionResponse &&
            response.transactionResponse.state
          ) {
            const code =
              response.transactionResponse.state === "APPROVED" ? 201 : 406;
            let route = tableName('paymentsEcommerce')
            console.log({ cost: product.price, coin: product.coin, userId, name: product.name, userName: user.fullName, email: user.email, event: product.event, color, size })
            if (code === 201) {
              await createDocument(route, {
                cost: product.price, coin: product.coin, userId, name: product.name, userName: user.fullName, email: user.email, event: product.event, color, size
              })
            }
            return res.status(code).json(response.transactionResponse);
          } else if (response.code === "ERROR" && response.error)
            throw Error(String(response.error));
          else throw Error("Wrong answer");
        }
      }
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send(String(err));
  }
}

module.exports = {
  createPay,
  createPayTicket,
  getPayments,
  buyProduct
};
