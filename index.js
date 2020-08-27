require("./process.env.js");
const { express: z_handler } = require("./zadarma");
const { api: z_api } = require("./zadarma");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use('/zadarma', z_handler);
app.listen(3000);

// (async function () {


// }
// )();
// ;
