# zadarma-js-api
Module which help you work with API Zadarma (v1)

## Requirements:
- Node.js

## How to use?
An official documentation on Zadarma API is [here](https://zadarma.com/support/api/).

## Getting Started

```shell
npm i zadarma -g
```

```js
const {api} = require("zadarma");
```

```js
const {api: z_api} = require("zadarma");
let response = await z_api({api_method: '/v1/info/balance/'});
console.log(response);
```
## Examples

#### single account use
```js
//Example configure default config
process.env.ZADARMA_USER_KEY = 'a248a6a984459935b569';//your user key
process.env.ZADARMA_SECRET_KEY = '8a8e91d214fb728889c7';//your secret key

let response = await z_api.request({
    api_method: '/v1/tariff/'
});
console.log(response);
```

#### multi account use
```js
//Example with send "api_user_key" && "api_secret_key"
let response = await z_api.request({
    api_method: '/v1/tariff/',
    api_user_key: 'a248a6a984459935b569',//your user key
    api_secret_key: '8a8e91d214fb728889c7'//your secret key
});
console.log(response);
```

#### parameters
```js
//Example with parameters
let response = await z_api.request({
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

#### http_method
```js
//Example with http_method "post" for api_method "/v1/sms/send/"
let from = '73919100000';
let to = '67200000000';

let response = await z_api.request({
    http_method: 'post',
    api_method: '/v1/sms/send/',
    params: {
        caller_id: from,
        number: to,
        message: 'test sms 0987654321\nтестовый текст'
    }
});
console.log(response);
```



