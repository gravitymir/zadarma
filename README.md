# zadarma-js-api
Class which help you work with API Zadarma (v1)

## Requirements:
- Node.js, JavaScript

## How to use?
An official documentation on Zadarma API is [here](https://zadarma.com/support/api/).

Keys for authorization are in [personal account](https://my.zadarma.com/api/).
[![Build Status](https://travis-ci.org/highlightjs/highlight.js.svg?branch=master)](https://travis-ci.org/highlightjs/highlight.js) [![Greenkeeper badge](https://badges.greenkeeper.io/highlightjs/highlight.js.svg)](https://greenkeeper.io/) [![install size](https://packagephobia.now.sh/badge?p=highlight.js)](https://packagephobia.now.sh/result?p=highlight.js)
## How to use?
<div class="highlight js">
let response;
    response = await z_api({api_method: '/v1/info/balance/'});
    console.log(response);

    api_user_key = process.env.ZADARMA_USER_KEY,
    api_secret_key = process.env.ZADARMA_SECRET_KEY

    response = await z_api.request({
        api_method: '/v1/request/callback/',
        params: {
            from: '380947102794',
            to: '380989897908',
            sip: '100',
            predicted: 'predicted'
        }
    });
    console.log(response);
</div>



