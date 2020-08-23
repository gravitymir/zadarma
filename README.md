# zadarma-js-api
Class which help you work with API Zadarma (v1)

## Requirements:
- Node.js, JavaScript

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
let response;
    response = await z_api({api_method: '/v1/info/balance/'});
    console.log(response);

    api_user_key = process.env.ZADARMA_USER_KEY,
    api_secret_key = process.env.ZADARMA_SECRET_KEY

    response = await z_api.request({
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





