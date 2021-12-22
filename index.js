/**
* Zadarma API
* Author: Andrey Sukhodeev
* Date: 23.12.2021
* 
* Description of methods
* https://zadarma.com/ru/support/api/
* https://zadarma.com/en/support/api/
* 
* request() returns data from responce / возвращает data из полученного response
*
* @request <Object> request_data
* @return <Object> response_data
*/

const axios = require('axios');
const crypto = require('crypto');
const httpBuildQuery = require('http-build-query');

const params_sort = function params_sort(obj) {
    let sorted = {};
    Object.keys(obj).sort().forEach(key => sorted[key] = obj[key]);
    return sorted;
}

const prepare_data_to_request = function prepare_data_to_request(obj) {
    let {
        method,
        params,
        userKey,
        secretKey
    } = obj;

    //For application/x-www-form-urlencoded, spaces are to be replaced by "+".
    //Для application/x-www-form-urlencoded пробелы должны быть заменены на "+",
    //paramsString = paramsString.replace(/%20/g, '+');


    //Page autorisation rules
    //https://zadarma.com/ru/support/api/#intro_authorization
    let paramsString = '';

    if (Object.keys(params).length > 0) {
        paramsString = httpBuildQuery(params_sort(params));
    }

    let md5 = crypto.createHash('md5')
        .update(paramsString).digest('hex');

    let data = method + paramsString + md5;

    if (secretKey && secretKey.length == 20) {

        let sha1 = crypto.createHmac('sha1', secretKey)
            .update(data).digest('hex');

        let sign = Buffer.from(sha1).toString('base64');

        return {
            headers: { 'Authorization': `${userKey}:${sign}` },
            paramsString: paramsString
        }
    }
    console.error('zadarma: api secret key is not are set!!!')
}

module.exports.api = async function request(obj) {
    let {//block set default parameters if not set
        baseURL = 'https://api.zadarma.com',
        api_method = '',
        params = {},
        http_method = 'GET',//GET || POST || PUT || DELETE
        api_user_key = process.env.ZADARMA_USER_KEY,
        api_secret_key = process.env.ZADARMA_SECRET_KEY,
        timeout = 0//number of milliseconds
    } = obj;

    if (api_method === '') {
        console.error('zadarma: api_method is empty!!!')
    }

    let { headers, paramsString } = prepare_data_to_request({
        method: api_method,
        params: params,
        userKey: api_user_key,
        secretKey: api_secret_key
    });

    return new Promise(resolve => {
        axios({
            baseURL: baseURL,
            method: http_method,
            url: http_method === 'GET' ? `${api_method}?${paramsString}` : api_method,
            data: paramsString,
            headers: headers,
            timeout: timeout
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            resolve(error?.response?.data || error);
        });
    });
};

module.exports.zadarma_express_handler = require('./zadarma_express_handler');
