/**
* Zadarma API
* Author: Andrey Sukhodeev
* Date: 2020
* 
* Description of methods
* https://zadarma.com/ru/support/api/
* https://zadarma.com/en/support/api/
* 
* request() возвращает data из полученного response
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

const prepare_data_to_request = function prepare_data_to_request(...args) {
  let {
    api_method,
    params = {},
    api_user_key = process.env.ZADARMA_USER_KEY,
    api_secret_key = process.env.ZADARMA_SECRET_KEY
  } = args.shift();

  let sorted_params = params_sort(params);

  //For application/x-www-form-urlencoded, spaces are to be replaced by "+".
  //Для application/x-www-form-urlencoded пробелы должны быть заменены на "+",
  //params_string = params_string.replace(/%20/g, '+');
  let params_string = httpBuildQuery(sorted_params);

  let md5 = crypto.createHash('md5')
    .update(params_string).digest('hex');

  let data = api_method + params_string + md5;

  if (api_secret_key && api_secret_key.length == 20) {

    let sha1 = crypto.createHmac('sha1', api_secret_key)
      .update(data).digest('hex');

    let sign = Buffer.from(sha1).toString('base64');

    return {
      headers: { "Authorization": `${api_user_key}:${sign}` },
      params_string: params_string
    }
  }

  throw new Error('api secret key is not set,  ')

}

module.exports.api = async function request(...args) {
  let { api_method, params, http_method = 'GET' } = args.shift();

  let { headers, params_string } = prepare_data_to_request({
    api_method: api_method,
    params: params
  });

  return new Promise(resolve => {
    axios({
      method: http_method,
      url: http_method === 'GET' ? `${api_method}?${params_string}` : api_method,
      baseURL: 'https://api.zadarma.com',
      data: params_string,
      headers: headers
    }).then(response => {
      resolve(response.data);
    }).catch(error => {
      resolve(error?.response?.data || error);
    });
  });
};

module.exports.zadarma_express_handler = require('./zadarma_express_handler');