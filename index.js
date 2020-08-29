require("./process.env.js");
const { zadarma_express_handler } = require("./zadarma");
const { api: z_api } = require("./zadarma");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

zadarma_express_handler.on('NOTIFY_START', function(ctx){
    console.log(ctx);
});

//console.log(zadarma_express_handler);

app.use('/zadarma', zadarma_express_handler);
app.listen(3000);

// (async function () {


// }
// )();
// ;


// class E {
//   constructor(){
//     this.x = 'constr public';
//   }
//   a = 'public a';
//   #b = 'private b';
//   static c = 'static c';
//   static #d = 'static private d';


//   m() {
//     return [this.a, this.#b, this.c, this.x];
//   }
// }


// console.log('class----------');
// console.log(E.a, E.b, E.c, E.d, E.x);
// let L = new E;
// console.log('new -----------');
// console.log(L.a, L.b, L.c, L.d, L.x);
// console.log('new method-----');
// console.log(L.m());