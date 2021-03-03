const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors());
app.use(require("./routes/index"));

app.listen(process.env.PORT || 8081, () => {
    console.log('Listen port: ', process.env.PORT || 8081);
});
