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
const httpBuildQuery = require('http-build-query');


const params_sort = function params_sort(obj){
    let ordered = {};
    Object.keys(obj).sort(/*(a, b) => a === b ? 0 : a > b ? 1 : -1*/)
    .forEach(key => ordered[key] = obj[key]);
    return ordered;
} 

const prepare = function prepare(...args){
    let {
        api_method,
        params = {},
        api_user_key = process.env.ZADARMA_USER_KEY,
        api_secret_key = process.env.ZADARMA_SECRET_KEY
    } = args.shift();


    let sorted_params = params_sort(params);
    
    let params_string = httpBuildQuery(sorted_params);
 

    //For application/x-www-form-urlencoded, spaces are to be replaced by "+".
    //Для application/x-www-form-urlencoded пробелы должны быть заменены на "+",
    //params_string = params_string.replace(/%20/g, '+');

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


/*
"""
    Function for send API request
    :param method: API method, including version number
    :param params: Query params
    :param request_type: (get|post|put|delete)
    :param format: (json|xml)
    :param is_auth: (True|False)
    :return: response
"""
*/ 
module.exports.api = async function request(...args){
    let {http_method = 'get', api_method, params} = args.shift();

    let {headers, params_string} = prepare({
        api_method: api_method,
        params: params
    });

    return new Promise(resolve => {
        console.log(http_method, ' ', api_method);
        console.log(params_string);

        axios({
            method: http_method,
            url: http_method.toLowerCase() === 'get' ? api_method + '?' + params_string: api_method,
            baseURL: 'https://api.zadarma.com',
            data: params_string,
            headers: headers
        }).then(response => {
            resolve(response.data);
        })
        .catch(error => {
            resolve(error?.response?.data || error);
        });
    });
};