# zadarma
Module which help you work with API Zadarma (v1)

## Requirements:
- Node.js > 14.0.0

## How to use?
An official documentation on Zadarma API is [here](https://zadarma.com/support/api/).

## Getting Started

#### Install

```shell
npm i zadarma -g
#or
npm i zadarma
#or
npm install zadarma
```
## Authorization keys
Page authorization keys: [here](https://my.zadarma.com/api/#)

## Usage examples
```js
const {api} = require("zadarma");
```

#### single account use
```js
//Example configure default config
process.env.ZADARMA_USER_KEY = 'a248a6a984459935b569';//your user key
process.env.ZADARMA_SECRET_KEY = '8a8e91d214fb728889c7';//your secret key

const {api} = require("zadarma");
let tariff = await api({api_method: '/v1/tariff/'});
let balance = await api({api_method: '/v1/info/balance/'});

console.log(tariff);
console.log(balance);
```

#### multi account use
```js
//Example with send "api_user_key" && "api_secret_key"
const {api: z_api} = require("zadarma");
let response = await z_api({
    api_method: '/v1/tariff/',
    api_user_key: 'a248a6a984459935b569',//your user key
    api_secret_key: '8a8e91d214fb728889c7'//your secret key
});
console.log(response);
```
```js
const {api: z_api} = require("zadarma");

let method = '/v1/tariff/';
let user_key = 'your_user_key';
let secret_key = 'your_secret_key';

let response = await z_api({
    api_method: method,
    api_user_key: user_key,
    api_secret_key: secret_key
});
console.log(response);
```

#### parameters
```js
//Example with parameters
let response = await z_api({
    api_method: '/v1/request/callback/',
    params: {
        from: '73919100000',
        to: '67200000000',
        sip: '100',
        predicted: 'predicted'
    }
});
console.log(response);
```

#### http_method "post"
```js
//Example with http_method "post" for api_method "/v1/sms/send/"
let from = '73919100000';
let to = '67200000000';
let message = 'test sms 0987654321\nтестовый текст';

let response = await z_api({
    http_method: 'post',
    api_method: '/v1/sms/send/',
    params: {
        caller_id: from,//[optional]
        number: to,
        message: message
    }
});
console.log(response);
```

#### zcrm methods
```js
let response = await z_api({api_method: '/v1/zcrm/customers'});
console.log(response);
```
```js
let response = await z_api({
        http_method: 'post',
        api_method: '/v1/zcrm/customers/labels',
        params: {
            "name": "Good company",
            "status": "company",
            "type": "client",
            "responsible_user_id": 20,
            "employees_count": "50",
            "comment": "",
            "country": "GB",
            "city": "London",
            "address": "",
            "zip": "",
            "website": "",
            "lead_source": "manual",
            "phones": [
            {
                "type": "work",
                "phone": "+44123456789"
            }
            ],
            "contacts": [
            {
                "type": "email_work",
                "value": "good_company@example.com"
            }
            ],
            "labels": [
                //{"id": 99938}
            ],
            "custom_properties": [
            {
                "id": 18,
                "value": "high"
            }
            ]
        }
    });

console.log(response);
```



