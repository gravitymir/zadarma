require("./process.env.js");
const { zadarma_express_handler } = require("./zadarma");

const { api: z_api } = require("./zadarma");
const express = require('express');

const app = express();

zadarma_express_handler.on('NOTIFY_START', function(response){
    console.log(response);
});
zadarma_express_handler.on('NOTIFY_END', function(response){
    console.log(response);
});
zadarma_express_handler.on('NOTIFY_OUT_START', function(response){
    console.log(response);
});
zadarma_express_handler.on('NOTIFY_OUT_END', function(response){
    console.log(response);
});
zadarma_express_handler.on('NOTIFY_RECORD', function(response){
    console.log(response);
});
zadarma_express_handler.on('SMS', function(response){
    console.log(response);
});

zadarma_express_handler.set_api_secret_key(process.env.ZADARMA_SECRET_KEY);

console.log(zadarma_express_handler);

app.use('/zadarma', zadarma_express_handler);
app.listen(3000);
