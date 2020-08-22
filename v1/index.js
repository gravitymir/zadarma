/*

Zadarma API
Author: Andrey Sukhodeev
Date: 2020

Description of methods
https://zadarma.com/ru/support/api/
https://zadarma.com/en/support/api/

*/

const axios = require('axios');
const crypto = require('crypto');

const prepare = function prepare(...args){
    let {
        api_method,
        params = {},
        api_user_key = process.env.ZADARMA_USER_KEY,
        api_secret_key = process.env.ZADARMA_SECRET_KEY
    } = args.shift();

    let params_string = Object.keys(params)
        .sort((a, b) => a === b ? 0 : a > b ? 1 : -1)
        .map(key => encodeURI(`${key}=${params[key]}`))
        .join('&');

    //For application/x-www-form-urlencoded, spaces are to be replaced by "+".
    //Для application/x-www-form-urlencoded пробелы должны быть заменены на "+",
    params_string = params_string.replace(/%20/g, '+');

    let md5 = crypto.createHash('md5')
        .update(params_string).digest('hex');

    let data = api_method + params_string + md5;

    let hex = crypto.createHmac('sha1', api_secret_key)
        .update(data).digest('hex');

    let sign = Buffer.from(hex).toString('base64');

    return {
        headers: {"Authorization": `${api_user_key}:${sign}`},
        params_string: params_string
    }
}

module.exports.api = async function request(...args){
    let {http_method = 'get', api_method, params} = args.shift();

    let {headers, params_string} = prepare({
        api_method: api_method,
        params: params
    });

    return new Promise(resolve => {

        axios({
            method: http_method,
            url: http_method.toLowerCase() === 'get' ? api_method + '?' + params_string: api_method,
            baseURL: 'https://api.zadarma.com',
            data: params_string,
            headers: headers})
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            resolve(error.response.data);
        });
    });
};