const axios = require('axios');
// const dateFns = require('date-fns');
// const querystring = require('querystring');
const crypto = require('crypto');
const userKey = process.env.ZADARMA_USER_KEY;
const secretKey = process.env.ZADARMA_SECRET_KEY;
// const today = new Date();
// const endOfDay = dateFns.endOfDay(today);
// const startOfDay = dateFns.startOfDay(today);

// const inspect = require('util').inspect;
//throw new Error('');
//https://zadarma.com
const prepare = function prepare(...args){

    let {api_link, params} = args.shift();

    let paramsStr = Object.keys(params)
        .sort((a, b) => a === b ? 0 : a > b ? 1 : -1)
        .map(key => encodeURI(`${key}=${params[key]}`))
        .join('&');

    let md5 = crypto.createHash('md5')
        .update(paramsStr).digest('hex');
    
    let hex = crypto.createHmac('sha1', secretKey)
        .update(`${api_link}${paramsStr}${md5}`).digest('hex');

    let sign = Buffer.from(hex).toString('base64');
    return {
        headers: {Authorization: `${userKey}:${sign}`},
        url: paramsStr ? `${api_link}?${paramsStr}`: `${api_link}`
    }
}

const request = function request(...args){
    let {method, api_link, params} = args.shift();

    let {url, headers} = prepare({
        api_link: api_link,
        params: params || ''
    });
    return axios({
        method: method || 'get',
        url: url,
        baseURL: 'https://api.zadarma.com',
        headers: headers
    }).catch(err => {
        //console.log(err.config);
        //console.log(err.response);
        console.log(err.response.headers);
        console.log(err.request);
        return {
            data: err.response.data
        }
    });
};

const api = exports = module.exports = {};
//https://zadarma.com/ru/support/api/
//https://zadarma.com/en/support/api/

api.infoBalance = async function infoBalance(){
    let res = await request({api_link: '/v1/info/balance/'});
    return res.data;
}

api.infoPrice = async function infoPrice(...args){
    if(!args.length || !args[0].to){
        throw new Error('no arguments passed infoPrice(), correct example infoPrice({[from: \'73919100000\'], to: \'67200000000\'})');
    }

    args[0].from = args[0].from || '';

    // :-) set default phone numbers
    //args[0].from = '73919100000';
    //args[0].to= '67200000000';
    let res = await request({
        api_link: '/v1/info/price/',
        params: {
            number: String(args[0].to).replace(/^\+/, ''),
            caller_id: String(args[0].from).replace(/^\+/, '')
        }
    });

    return res.data;
}

api.infoTimezone = async function infoTimezone(){
    let res = await request({api_link: '/v1/info/timezone/'});
    return res.data;
}

api.tariff = async function tariff(){
    let res = await request({api_link: '/v1/tariff/'});
    return res.data;
}

api.requestCallback = async function requestCallback(...args){
    let res = await request({
        api_link: '/v1/request/callback/',
        params: {
            from: args[0].from,
            to: args[0].to,
            sip: args[0].sip || '',
            predicted: args[0].predicted || ''
        
        }
    });
    return res.data;
}

api.sip = async function sip(){
    let res = await request({api_link: '/v1/sip/'});
    return res.data;
}

api.sipStatus = async function sipStatus(sip_number){

    if(!sip_number){
        throw new Error('no arguments passed sipStatus(), correct example sipStatus(sip_number)');
    }
    let res = await request({api_link: '/v1/sip/' + sip_number + '/status/'});
    return res.data;
};

//not work PUT
api.sipChangeCallerId = async function sipChangeCallerId(...args){

    let res = await request({
        method: 'put',
        api_link: '/v1/sip/callerid/',
        params: {
            id: args[0].id,
            number: args[0].number
        }
    
    });
    return res.data;
};

api.sipRedirection = async function sipRedirection(sip_id){
    let res = await request({
        api_link: '/v1/sip/redirection/',
        params: {
            id: sip_id || ''
        }
    });

    return res.data;
}

api.directNumbers = async function directNumbers(){
    let res = await request({api_link: '/v1/direct_numbers/'});
    return res.data;
}

//not work PUT
api.sipOnOffRedirection = async function sipOnOffRedirection(...args){
    let res = await request({
        method: 'put',
        api_link: '/v1/sip/redirection/',
        params: {
            id: args[0].id,
            statut: args[0].status
        }
    });
    return res.data;
}
//not work PUT
api.sipChangeRedirection = async function sipChangeRedirection(...args){
    let res = await request({
        method: 'put',
        api_link: '/v1/sip/redirection/',
        params: {
            id: args[0].id,
            type: args[0].type,
            number: args[0].number
        }
    });
    return res.data;
}

api.pbxInternal = async function pbxInternal(){
    let res = await request({api_link: '/v1/pbx/internal/'});
    return res.data;
};

api.pbxInternalStatus = async function pbxInternalStatus(internal_number){

    if(!internal_number){
        throw new Error('no arguments passed pbxInternalStatus(), correct example pbxInternalStatus(internal_number), (from: api.internal() numbers array)');
    }
    let res = await request({api_link: '/v1/pbx/internal/' + internal_number + '/status/'});
    console.log(res);
    return res.data;
};

//not work PUT
api.pbxInternalOnOffRecording = async function pbxInternalOnOffRecording(...args){

    let res = await request({
        method: 'put',
        api_link: '/v1/pbx/internal/recording/',
        params: {
            id: 100,
            status: 'on_store',
            email: ''
        }
    });

    return res.data;
};

api.pbxRecordRequest = async function getRecordFileUrl(...args){
    const {pbx_call_id} = args[0];
    let res = await request({
        method: '/v1/pbx/record/request/',
        params: {
            call_id: call_id || '',
            pbx_call_id: pbx_call_id || '',
            lifetime: lifetime || ''
        }
    });
    return res.data.links[0] ? res.data.links[0]: res.data.link;
}


api.pbxChangeOnOffRedirection = async function pbxChangeRedirection(...args){
    let res = await request({
        method: 'post',
        api_link: '/v1/pbx/redirection/',
        params: {
            pbx_number: args[0].pbx_number,
            status: args[0].status,
            type: args[0].type,
            destination: args[0].destination,
            condition: condition,
            voicemail_greeting: voicemail_greeting,
            greeting_file: greeting_file,
        }
    });
    return res.data;
}

api.pbxRedirection = async function pbxRedirection(...args){
    let res = await request({
        api_link: '/v1/pbx/redirection/',
        params: {
            pbx_number: args[0].pbx_number
        }
    });
    return res.data;
}

api.smsSend = async function smsSend(...args){
    let res = await request({
        method: 'post',
        api_link: '/v1/sms/send/',
        params: {
            number: args[0].number,
            message: args[0].message,
            caller_id: args[0].caller_id || ''
        }
    });
    return res.data;
}


api.statistics = async function statistics(...args){
    let res = await request({
        api_link: '/v1/statistics/',
        params: {
            start: start,
            end: end,
            sip: sip,
            cost_only: cost_only,
            type: type,
            skip: skip,
            limit: limit
        }
    });
    return res.data;
}

api.statisticsPbx = async function statisticsPbx(...args){
    let res = await request({
        api_link: '/v1/statistics/pbx/',
        params: {
            start: start,
            end: end,
            version: version,
            skip: skip,
            limit: limit,
            call_type: call_type
        }
    });
    return res.data;
}

api.statisticsCallbackWidget = async function statisticsCallbackWidget(...args){
    let res = await request({
        api_link: '/v1/statistics/callback_widget/',
        params: {
            start: start,
            end: end,
            widget_id: widget_id
        }
    });
    return res.data;
}


api.infoNumberLookup = async function infoNumberLookup(...args){
    let res = await request({
        method: 'post',
        api_link: '/v1/info/number_lookup/',
        params: {
            numbers: numbers
        }
    });
    return res.data;
}









