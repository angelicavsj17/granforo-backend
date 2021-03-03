const nodemailer = require("nodemailer");
const path = require('path')
var hbs = require('nodemailer-express-handlebars');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: 'granforonovoclick@gmail.com',
        pass: 'granforo2020'
    },
});

transporter.use("compile", hbs({
    viewEngine: {
        partialsDir: "template path",
        defaultLayout: ""
    },
    viewPath: path.resolve(__dirname, './templates/'),
    extName: ".hbs"
}));
function sendMail({ to, subject, params = {}, name = 'ticket' }) {
    console.log(to, subject, params, 'this is info')
    transporter.sendMail({
        from: `"Gran foro" granforonovoclick@gmail.com`,
        to: to,
        subject: subject,
        template: name,
        context: {
            ...params
        }
    }).catch((e) => console.log(e, 'this is error')).then((data) => {
        console.log('sended', data)
    })
}

// ********** ejemplo ***************

// sendMail({
//     to: 'ferfamania1501@gmail.com', subject: 'Ticket comprado', name: 'ticket', params: {
//         name: 'Nombre del evento',
//         description: 'Deserunt Lorem pariatur laborum do excepteur velit ex nostrud dolor officia. Anim ad sint reprehenderit id labore reprehenderit commodo dolor fugiat Lorem mollit officia. Laborum in occaecat nisi culpa fugiat in.'
//     }
// })

module.exports = {
    sendMail,
    hostname: 'https://develop.d1s328ocgwk1ak.amplifyapp.com/'
}