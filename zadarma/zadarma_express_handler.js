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

const verify_data = function verify_data(data_string, signature) {

  let sha1 = crypto.createHmac('sha1', api_secret_key)
    .update(data_string).digest('hex');

  return Buffer.from(sha1).toString('base64') === signature;
}

const zadarma_events_list = [
  'NOTIFY_START',
  'NOTIFY_INTERNAL',//method not implemented
  'NOTIFY_ANSWER',//method not implemented
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

const temporary_storage = {};
const user_handlers = {};

const z_log = function(ctx, data){
  console.log(data);
  console.log(`Zadarma event ${data.event} from ${ctx.from} to ${ctx.to} verify: ${ctx.verify}`);

}

const handlers = {
  'NOTIFY_START': function NOTIFY_START(data, signature){

    let [direction] = data.pbx_call_id.split('_');

    temporary_storage[data.pbx_call_id] = {
      event: [data.event],
      pbx_call_id: data.pbx_call_id,
      id: data.pbx_call_id,
      direction: direction,
      start: data.call_start,
      call_start: data.call_start,
      from: data.caller_id,
      to: data.called_did,
      verify: verify_data(`${data.caller_id}${data.called_did}${data.call_start}`, signature)
    }

    return temporary_storage[data.pbx_call_id];
  },
  'NOTIFY_END': function NOTIFY_END(data, signature){
    temporary_storage[data.pbx_call_id].event.push(data.event);
    
    let response = Object.assign(
      {},
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

    delete temporary_storage[data.pbx_call_id];
    return response;
  },
  'NOTIFY_OUT_START': function NOTIFY_OUT_START(data, signature){

    let [direction] = data.pbx_call_id.split('_');

    temporary_storage[data.pbx_call_id] = {
      event: [data.event],
      pbx_call_id: data.pbx_call_id,
      id: data.pbx_call_id,
      direction: direction,
      start: data.call_start,
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

    let response = Object.assign(
      {},
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

    if(data.is_recorded && parseInt(data.duration)){
      return response;
    }
    delete temporary_storage[data.pbx_call_id];
    return response;
  },
  'NOTIFY_INTERNAL': function NOTIFY_INTERNAL(data, signature){
    temporary_storage[data.pbx_call_id] = Object.assign(
      temporary_storage[data.pbx_call_id],
      {
        event: temporary_storage[data.pbx_call_id].event.push(data.event),
        internal: data.internal,
        verify: verify_data(`${data.caller_id}${data.called_did}${data.call_start}`, signature)
      }
    );
    return temporary_storage[data.pbx_call_id];
  },

  'NOTIFY_ANSWER': function NOTIFY_INTERNAL(data, signature){
    temporary_storage[data.pbx_call_id] = Object.assign(
      temporary_storage[data.pbx_call_id],
      {
        event: temporary_storage[data.pbx_call_id].event.push(data.event),
        internal: data.internal,
        destination: data.destination,
        dst_e164: data.dst_e164,
        verify: verify_data(`${data.caller_id}${data.destination}${data.call_start}`, signature)
      }
    );
    return temporary_storage[data.pbx_call_id];
  },

  'NOTIFY_RECORD': function NOTIFY_RECORD(data, signature){
    temporary_storage[data.pbx_call_id].event.push(data.event);
    temporary_storage[data.pbx_call_id].call_id_with_rec = data.call_id_with_rec;
    temporary_storage[data.pbx_call_id].verify = verify_data(`${data.pbx_call_id}${data.call_id_with_rec}`, signature);

    let response = Object.assign(
      {},
      temporary_storage[data.pbx_call_id]
    );

    delete temporary_storage[data.pbx_call_id];
    return response;
  }
}

const entry_handler = function entry_handler({body: data, headers}){
  const ctx = handlers[data.event](data, headers.signature);
  
  z_log(ctx, data);

  if(typeof user_handlers[data.event] === 'function'){
    return user_handlers[data.event](ctx);
  }
}

const zadarma_express_handler = function zadarma_express_handler(req, res){
  if (!verify_ip(req)) {
    return res.end();
  } else if (req.body?.zd_echo) {
    //zadarma api performance check
    console.log('the api zadarma checks the un with an echo request');
    return res.end(req.body.zd_echo);
  }
  res.end();
  
  return entry_handler(req);
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


module.exports = zadarma_express_handler;