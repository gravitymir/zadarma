/*
ip zadarma service
https://my.zadarma.com/api/#apitab-zcrm
from the bottom of the page
*/
const verify_ip = function verify_ip(req) {
  //http://164.90.214.160:8080/zadarma link to check and connect botton 
  return '185.45.152.42' === (req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress.split(':').pop());
}

const zadarma_events_list = [
  'NOTIFY_START',
  'NOTIFY_INTERNAL',
  'NOTIFY_ANSWER',
  'NOTIFY_END',
  'NOTIFY_OUT_START',
  'NOTIFY_OUT_END',
  'NOTIFY_RECORD',
  'NOTIFY_IVR',
  'SPEECH_RECOGNITION',
  'NUMBER_LOOKUP',
  'CALL_TRACKING',
  'SMS'
];

const temporary_storage = {};
const user_handlers = {};

const handlers = {
  'NOTIFY_START': function NOTIFY_START(query){

    let [, direction] = query.pbx_call_id.split('_');

    temporary_storage[query.pbx_call_id] = {
      id: pbx_call_id,
      direction: direction,
      start: query.call_start,
      from: query.caller_id,
      to: query.called_did
    }
  },
  'NOTIFY_END': function NOTIFY_END(query){
    temporary_storage[query.pbx_call_id] = {
      duration: query.duration,
      status: query.disposition,
      status_code: query.status_code,
      is_recorded: query.is_recorded
    }
  }
}


{
  event: 'NOTIFY_END',
  call_start: '2020-08-29 06:16:08',
  pbx_call_id: 'in_54090708a0cd502aacd464a8fa4f232536392022',
  caller_id: '+380989897908',
  called_did: '380947102794',
  duration: '0',
  disposition: 'cancel',
  status_code: '16',
  is_recorded: '0'
}


const entry_handler = function entry_handler(body){

  if(typeof user_handlers[body.event] === 'function'){
    return user_handlers[body.event](ctx);
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

  
  return entry_handler(req.body);
}

zadarma_express_handler.on = function on(event_name, callback_function){
  if(!zadarma_events_list.includes(event_name)){
    throw new Error('an unknown event handler is set, set handler from the list:\n' + zadarma_events_list.join(',\n'));
  }
  user_handlers[event_name] = callback_function;
}

module.exports = zadarma_express_handler;