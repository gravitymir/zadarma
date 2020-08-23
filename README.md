# zadarma-js-api
Module which help you work with API Zadarma (v1)

## Requirements:
- Node.js
- JavaScript

## How to use?
An official documentation on Zadarma API is [here](https://zadarma.com/support/api/).

## Getting Started

```shell
npm i zadarma -g
```

```js
const {api} = require("zadarma");
//or
const {api: z_api} = require("zadarma");
```

#### 
```shell
npm i zadarma -g
```

## Using with Express
```js
const {express_middleware_zadarma} = require("./v1/index.js");
```

```js
    const {api: z_api} = require("zadarma");
    let response = await z_api({api_method: '/v1/info/balance/'});
    console.log(response);
```

#### Single account use
```js

    process.env.ZADARMA_USER_KEY = '11111111111111111111'
    process.env.ZADARMA_SECRET_KEY = '11111111111111111111'
    
    let response = await z_api.request({
        api_method: '/v1/tariff/'
    });
    console.log(response);
```

#### Multi account use
```js
    let response = await z_api.request({
        api_method: '/v1/tariff/',
        api_user_key: 'a248a6a984459935b569', 
        api_secret_key: '8a8e91d214fb728889c7'
    });
    console.log(response);
```


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




