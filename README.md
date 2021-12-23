[![version](https://img.shields.io/github/package-json/v/gravitymir/zadarma?logo=npm)](https://www.npmjs.com/package/zadarma)
[![npm downloads per month](https://img.shields.io/npm/dm/zadarma?logo=npm)](https://www.npmjs.com/package/zadarma)
[![license](https://img.shields.io/npm/l/zadarma?logo=npm)](https://www.npmjs.com/package/zadarma)

![GitHub last commit](https://img.shields.io/github/last-commit/gravitymir/zadarma?logo=github)
![Github Repository Size](https://img.shields.io/github/repo-size/gravitymir/zadarma?logo=github)
[![Github forks](https://img.shields.io/github/forks/gravitymir/zadarma?logo=github)](https://github.com/gravitymir/zadarma/network/members)
![Lines of code](https://img.shields.io/tokei/lines/github.com/gravitymir/zadarma?logo=github)
[![GitHub open issues](https://img.shields.io/github/issues/gravitymir/zadarma?logo=github)](https://github.com/gravitymir/zadarma/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/gravitymir/zadarma?logo=github)](https://github.com/gravitymir/zadarma/issues)

[![GitHub Repo stars](https://img.shields.io/github/stars/gravitymir/zadarma?label=zadarma&logo=github&color=505050&logoColor=fff)](https://github.com/gravitymir/zadarma)
[![GitHub User's stars](https://img.shields.io/github/stars/gravitymir?label=gravitymir&logo=github&color=505050&logoColor=fff)](https://github.com/gravitymir)

# zadarma

![Zadarma Nodes.js](https://raw.githubusercontent.com/gravitymir/zadarma/master/zadarma_node.jpeg)

Module which help you work with API Zadarma (v1)

## Requirements:

* Node.js > 14.0.0

## How to use?

An official documentation on Zadarma API is [here](https://zadarma.com/support/api/).

## Getting Started

#### Install

``` shell
#npm
npm install zadarma
#or
npm i zadarma
```

## Authorization keys

Page authorization keys: [here](https://my.zadarma.com/api/#)

## Usage examples

``` js
const { api } = require("zadarma");
```

#### single account use

``` js
//Example configure default config
const { api } = require("zadarma");

process.env.ZADARMA_USER_KEY = 'a248a6a984459935b569';//your user key
process.env.ZADARMA_SECRET_KEY = '8a8e91d214fb728889c7';//your secret key

(async () => {
    //https://zadarma.com/ru/support/api/#api_info_balance
    let balance = await api({api_method: '/v1/info/balance/'});
    
    //https://zadarma.com/ru/support/api/#api_info_timezone
    let timezone = await api({api_method: '/v1/info/timezone/'});

    //https://zadarma.com/ru/support/api/#api_tariff
    let tariff = await api({api_method: '/v1/tariff/'});

    console.log(balance);
    console.log(timezone);
    console.log(tariff);
})()
```

#### multi account use

``` js
//Example with send "api_user_key" && "api_secret_key"
const { api: z_api/*rename "api": "your name"*/ } = require("zadarma");

(async () => {

    let response = await z_api({
        api_method: '/v1/direct_numbers/',
        api_user_key: 'a248a6a984459935b569', //your user key
        api_secret_key: '8a8e91d217fb728889c7' //your secret key
    });
    console.log(response);

})()
```

``` js
const { api: z_api } = require("zadarma");

let method = '/v1/pbx/internal/';
let user_key = 'your_user_key';
let secret_key = 'your_secret_key';

(async () => {
    let dataObj = await z_api({
        api_method: method,
        api_user_key: user_key,
        api_secret_key: secret_key
    });
    console.log(dataObj);
})()

```
``` js
const { api: z_api } = require("zadarma");

let method = '/v1/pbx/callinfo/';
let user_key = 'your_user_key';
let secret_key = 'your_secret_key';

(async () => {
    let dataObj = await z_api({
        api_method: method,
        api_user_key: user_key,
        api_secret_key: secret_key
    });
    console.log(dataObj);
})()

```

#### parameters

``` js
//https://zadarma.com/ru/support/api/#api_callback
const { api: z_api } = require("zadarma");

let userKey = 'your_user_key 20 symbols';
let secretKey = 'user_secret_key 20 symbols';

(async () => {
    //Example with parameters
    let response = await z_api({
        api_method: '/v1/request/callback/',
        api_user_key: userKey,
        api_secret_key: secretKey,
        params: {
            from: '73919100000',
            to: '67200000000',
            sip: '100',
            predicted: 'predicted'
        }
    });
    console.log(response);
})()
```

#### http_method "post"

``` js
//https://zadarma.com/ru/support/api/#api_sms_send

let from = '67200000000'; //[optional] your verified phone number
let to = '67200000000';
let message = 'Test sms 0987654321\nТестовый текст';

let response = await z_api({
    http_method: 'POST',
    api_method: '/v1/sms/send/',
    params: {
        caller_id: from, //[optional]
        number: to,
        message: message
    }
});
console.log(response);
```

#### zcrm methods examples
ZCRM integration on/off page [here](https://my.zadarma.com/api/#apitab-zcrm)

``` js
//example get all customers
process.env.ZADARMA_USER_KEY = 'a248a6a984459935b569';//your user key
process.env.ZADARMA_SECRET_KEY = '8a8e91d214fb728889c7';//your secret key

let response = await z_api({
    api_method: '/v1/zcrm/customers'
});
console.log(response);
```

``` js
//example create customer
let response = await z_api({
    http_method: 'POST',
    api_method: '/v1/zcrm/customers',
    params: {
        customer: {
            "name": "Good company 32",
            "status": "company",
            "type": "client",
            "responsible_user_id": "",
            "employees_count": "50",
            "comment": "",
            "country": "GB",
            "city": "London",
            "address": "",
            "zip": "",
            "website": "",
            "lead_source": "manual",
            "phones": [{
                "type": "work",
                "phone": "+44123456100"
            }],
            "contacts": [{
                "type": "email_work",
                "value": "good_company@example.com"
            }],
            "labels": [],
            "custom_properties": []
        }
    }
});
console.log(response);
```

``` js
//example create, get, delete customers

//create labal 1
let response = await z_api({
    http_method: 'POST',
    api_method: '/v1/zcrm/customers/labels',
    params: {
        name: 'label 1'
    }
});

//create label 2
response = await z_api({
    http_method: 'POST',
    api_method: '/v1/zcrm/customers/labels',
    params: {
        name: 'label 2'
    }
});

//get all labels
response = await z_api({
    api_method: '/v1/zcrm/customers/labels'
});
console.log(response.data.labels);

for (label of response.data.labels) {
    //delete label
    response = await z_api({
        http_method: 'DELETE',
        api_method: `/v1/zcrm/customers/labels/${label.id}`
    });
    console.log( `label id ${label.id} deleted!` );
}

//get all labels
response = await z_api({
    api_method: '/v1/zcrm/customers/labels'
});
console.log(response.data.labels);
```

# Handle event requests with Express

[API settings and description page](https://zadarma.com/support/api/)

[Set link to your hendler server on API description page](https://my.zadarma.com/api/#apitab-zcrm)

<b>Example link</b>: http://YOUR_IP:3000/zadarma

### Events

1. NOTIFY_START - start incoming call
1. NOTIFY_INTERNAL - dialing up to the internal on incoming call
1. NOTIFY_ANSWER - the internal answered theincoming call
1. NOTIFY_END - end incoming call
1. NOTIFY_OUT_START
1. NOTIFY_OUT_END
1. NOTIFY_RECORD - call recording is being prepared for download
1. NOTIFY_IVR
1. SPEECH_RECOGNITION
1. NUMBER_LOOKUP
1. CALL_TRACKING
1. SMS - incoming sms
1. NOTIFY_INTERNAL_END - halloween event ) событие не описано в документации на 22.12.2021

```js
const { zadarma_express_handler } = require("zadarma");

const express = require('express');

const app = express();

process.env.ZADARMA_SECRET_KEY = 'de4b346b835b86158233';//your secret key

//https://zadarma.com/ru/support/api/#api_webhook_notify_start
zadarma_express_handler.on('NOTIFY_START', (request, response) => {
  
  console.log(request);

  response.set('Content-Type', 'application/json');
  //res.json({"ivr_play": "ID"})
  //res.json({"redirect": "ID", ["return_timeout": TIMEOUT]})
  //res.json({"hangup": 1})
  //res.json({"ivr_saypopular": 1, "language": "en"})

  res.json({
    "ivr_saynumber": "123",
    "language": "en"
  })

  res.end()
});


zadarma_express_handler.on('NOTIFY_END', request => {
  let all_calls_before_clear_storage = zadarma_express_handler.get_temporary_storage();
  zadarma_express_handler.clear_temporary_storage();
  console.log(request);
});


zadarma_express_handler.on('NOTIFY_OUT_START', request => {
    console.log(request);
    
});

zadarma_express_handler.on('NOTIFY_OUT_END', request => {
  zadarma_express_handler.clear_temporary_storage(request.pbx_call_id);
  console.log(request);
});


const { api: z_api/*rename "api": "your name"*/ } = require("zadarma");

zadarma_express_handler.on('NOTIFY_RECORD', async incoming_request => {
    //Need dalay, if not wait few time, servise Zadarma send message ~~~"File not found"!
    setTimeout(async () => {
    
        let res = await z_api({
            api_method: '/v1/pbx/record/request/',
            api_user_key: 'a248a6a984459935b569', // || [process.env.ZADARMA_USER_KEY]
            api_secret_key: '8a8e91d217fb728889c7', // || [process.env.ZADARMA_SECRET_KEY]
            params: {
                pbx_call_id: incoming_request.pbx_call_id,
                lifetime : 7200
            }
        });
        console.log(res)
        //console.log(res.data.links[0] ? res.data.links[0]: res.data.link)
        //console.log(res.links[0] ? res.links[0]: res.link)
        
    }, 15000);//15sec [variable, need test optimal time dalay] if not important put more
});

zadarma_express_handler.on('SMS', request => {
  console.log(request);
});

app.use('/zadarma', zadarma_express_handler);
app.listen(3000); //app.listen(your port)
````
