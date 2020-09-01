const crypto = require('crypto');

/*
ip zadarma service
https://my.zadarma.com/api/#apitab-zcrm
from the bottom of the page
*/
let api_secret_key// = process.env.ZADARMA_SECRET_KEY;

const verify_ip = function verify_ip(req) {
  //http://164.90.214.160:8080/zadarma link to check and connect botton 
  return '185.45.152.42' === (req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress.split(':').pop());
}

const parse_incoming_data_to_body_obj = function parse_incoming_data_to_body_obj(req) {
  return new Promise(function(resolve, reject){
    let data = '';

    req.on('data', function(chunk){
      data += chunk;
    })
    
    req.on('end', function(){
      let str = data.toString('utf-8');
      let array_pre_obj = str.split('&').map(i => i.split('='));
      
      resolve(Object.fromEntries(array_pre_obj));
    })

    req.on('error', function(error){
      console.error(error);
      reject({});
    });
  });
}

const check_zd_echo = function check_zd_echo(req) {
  return !!req.body?.zd_echo
}

const verify_data = function verify_data(data_string, signature) {

  let sha1 = crypto.createHmac('sha1', api_secret_key)
    .update(data_string).digest('hex');

  return Buffer.from(sha1).toString('base64') === signature;
}

const zadarma_events_list = [
  'NOTIFY_START',
  'NOTIFY_INTERNAL',
  'NOTIFY_ANSWER',
  'NOTIFY_END',
  'NOTIFY_OUT_START',
  'NOTIFY_OUT_END',
  'NOTIFY_RECORD',
  'NOTIFY_IVR',//method not implemented
  'SPEECH_RECOGNITION',//method not implemented
  'NUMBER_LOOKUP',//method not implemented
  'CALL_TRACKING',//method not implemented
  'SMS'
];

const handlers = {
  'NOTIFY_START': function NOTIFY_START(data, signature){

    temporary_storage[data.pbx_call_id] = {
      event: [data.event],
      pbx_call_id: data.pbx_call_id,
      call_start: data.call_start,
      from: data.caller_id,
      to: data.called_did,
      verify: verify_data(`${data.caller_id}${data.called_did}${data.call_start}`, signature)
    }

    return temporary_storage[data.pbx_call_id];
  },
  'NOTIFY_END': function NOTIFY_END(data, signature){
    temporary_storage[data.pbx_call_id].event.push(data.event);
    
    Object.assign(
      temporary_storage[data.pbx_call_id],
      {
        duration: data.duration,
        disposition: data.disposition,
        status: data.disposition,
        status_code: data.status_code,
        is_recorded: data.is_recorded,
        verify: verify_data(`${data.caller_id}${data.called_did}${data.call_start}`, signature)
      }  
    );
    return temporary_storage[data.pbx_call_id];
  },
  'NOTIFY_OUT_START': function NOTIFY_OUT_START(data, signature){

    temporary_storage[data.pbx_call_id] = {
      event: [data.event],
      pbx_call_id: data.pbx_call_id,
      call_start: data.call_start,
      internal: data.internal,
      caller_id: data.caller_id,
      from: data.caller_id,
      destination: data.destination,
      to: data.destination,
      to_e164: data.dst_e164,
      verify: verify_data(`${data.internal}${data.destination}${data.call_start}`, signature)
    }

    return temporary_storage[data.pbx_call_id];
  },
  'NOTIFY_OUT_END': function NOTIFY_OUT_END(data, signature){

    temporary_storage[data.pbx_call_id].event.push(data.event);

    Object.assign(
      temporary_storage[data.pbx_call_id],
      {
        duration: data.duration,
        disposition: data.disposition,
        status: data.disposition,
        status_code: data.status_code,
        is_recorded: data.is_recorded,
        call_id_with_rec: data.call_id_with_rec,
        verify: verify_data(`${data.internal}${data.destination}${data.call_start}`, signature)
      }
    );

    return temporary_storage[data.pbx_call_id]
  },
  'NOTIFY_INTERNAL': function NOTIFY_INTERNAL(data, signature){

    temporary_storage[data.pbx_call_id].event.push(data.event)
    temporary_storage[data.pbx_call_id].internal = data.internal;
    temporary_storage[data.pbx_call_id].verify = verify_data(`${data.caller_id}${data.called_did}${data.call_start}`, signature)

    return temporary_storage[data.pbx_call_id];
  },

  'NOTIFY_ANSWER': function NOTIFY_INTERNAL(data, signature){

    temporary_storage[data.pbx_call_id].event.push(data.event);
    temporary_storage[data.pbx_call_id].internal = data.internal;
    temporary_storage[data.pbx_call_id].destination = data.destination;
    temporary_storage[data.pbx_call_id].dst_e164 = data.dst_e164;
    temporary_storage[data.pbx_call_id].verify = verify_data(`${data.caller_id}${data.destination}${data.call_start}`, signature);

    return temporary_storage[data.pbx_call_id];
  },

  'NOTIFY_RECORD': function NOTIFY_RECORD(data, signature){
    
    temporary_storage[data.pbx_call_id].event.push(data.event);
    temporary_storage[data.pbx_call_id].call_id_with_rec = data.call_id_with_rec;
    temporary_storage[data.pbx_call_id].verify = verify_data(`${data.pbx_call_id}${data.call_id_with_rec}`, signature);
    
    return temporary_storage[data.pbx_call_id]
  },
  'SMS': function SMS(data, signature){
    
    const result = JSON.parse(data.result);

    return {
      event: data.event,
      caller_id: result.caller_id,
      caller_did: result.caller_did,
      from: result.caller_id,
      to: result.caller_did,
      verify: verify_data(`${data.result}`, signature)
    };
  }
}

const temporary_storage = {};
const user_handlers = {};

const zadarma_express_handler = async function zadarma_express_handler(req, res){
  if(!verify_ip(req)){
    return res.end()
  }
  
  console.log('req.query', !!Object.keys(req.query).length, req.query);

  if(Object.keys(req.query).length){
    req.body = req.query;
  }else{
    req.body = await parse_incoming_data_to_body_obj(req);
  }

  if(check_zd_echo(req)){
    //zadarma api performance check
    console.log('the api zadarma checks the un with an echo request');
    return res.end(req.body.zd_echo);
  }

  const ctx = handlers[req.body.event](req.body, req.headers.signature);

  if(typeof user_handlers[req.body.event] === 'function'){
    return user_handlers[req.body.event](ctx);
  }
}

zadarma_express_handler.on = function on(event_name, user_callback_function){
  if(!zadarma_events_list.includes(event_name)){
    throw new Error('an unknown event handler is set, set handler from the list:\n'+
      zadarma_events_list.join(',\n')
    );
  }
  user_handlers[event_name] = user_callback_function;
}

zadarma_express_handler.set_api_secret_key = function set_api_secret_key(key){
  api_secret_key = key;
}

zadarma_express_handler.clear_temporary_storage = function clear_temporary_storage(id){
  if(id){
    delete temporary_storage[id]
  }else{
    temporary_storage = {};
  }
}
zadarma_express_handler.get_temporary_storage = function get_temporary_storage(){
  return temporary_storage;
}

module.exports = zadarma_express_handler;