const crypto = require('crypto');

/*
ip zadarma service
https://my.zadarma.com/api/#apitab-zcrm
from the bottom of the page
*/

const verify_ip = function verify_ip(req) {
  return '185.45.152.42' === (req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress.split(':').pop());
}

const parse_incoming_data_to_body_obj = function parse_incoming_data_to_body_obj(req) {
  return new Promise(function (resolve, reject) {
    let incoming_data = '';

    req.on('data', function (chunk) {
      incoming_data += chunk;
    })

    req.on('end', function () {
      console.log(req.headers)
      let data_string = incoming_data.toString('utf-8');
      data_string = data_string.replace(/%20/g, '+')
      if (req.headers['content-type'].includes("application/x-www-form-urlencoded")) {
        let array_pre_obj = data_string.split('&').map(i => {
          i = i.split('=');
          i[1] = decodeURIComponent(i[1]);
          return i;
        });
        resolve(Object.fromEntries(array_pre_obj));
      } else if (req.headers['content-type'].includes('multipart/form-data')) {

        let obj = {};
        let boundary = req.headers['content-type'].split('boundary=').pop();
        let data_group = [...data_string.matchAll(/name=\"(\w+)\"\r\n\r\n/g)];

        data_group.forEach(element => {
          let name = element[1];
          let start = element.input.indexOf(element[0]) + element[0].length;

          /* '--' Zadarma server side bug (headers boundary != body boundary)
          need add '--' to boundry in body or substract '--' from headers boundary */
          let end = element.input.indexOf(`\r\n--${boundary}`, start);

          obj[name] = element.input.substring(start, end);
        });

        resolve(obj);

      }
    })

    req.on('error', function (error) {
      console.error(error);
      reject({});
    });
  });
}

const check_zd_echo = function check_zd_echo(req) {
  return !!req.body?.zd_echo
}

const verify_data = function verify_data(data_string, signature) {

  let sha1 = crypto.createHmac('sha1', process.env.ZADARMA_SECRET_KEY)
    .update(data_string).digest('hex');

  return Buffer.from(sha1).toString('base64') === signature;
}

const zadarma_events_list = [
  'NOTIFY_START',
  'NOTIFY_INTERNAL',

  //The event causing the error
  'NOTIFY_INTERNAL_END',//Bug !!! Event not in docs https://zadarma.com/ru/support/api/#api_webhooks
  //Gost Event

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

const handlers = {
  'NOTIFY_START': function NOTIFY_START(data, signature) {
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
  'NOTIFY_END': function NOTIFY_END(data, signature) {
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
  'NOTIFY_OUT_START': function NOTIFY_OUT_START(data, signature) {

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
  'NOTIFY_OUT_END': function NOTIFY_OUT_END(data, signature) {

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
  'NOTIFY_INTERNAL': function NOTIFY_INTERNAL(data, signature) {

    temporary_storage[data.pbx_call_id].event.push(data.event)
    temporary_storage[data.pbx_call_id].internal = data.internal;
    temporary_storage[data.pbx_call_id].verify = verify_data(`${data.caller_id}${data.called_did}${data.call_start}`, signature)

    return temporary_storage[data.pbx_call_id];
  },

  //Bug !!! Event not in docs
  //https://zadarma.com/ru/support/api/#api_webhooks
  'NOTIFY_INTERNAL_END': function NOTIFY_INTERNAL_END(data, signature) {
    temporary_storage[data.pbx_call_id].event.push(data.event)
    temporary_storage[data.pbx_call_id].internal = data.internal;
    temporary_storage[data.pbx_call_id].verify = verify_data(`${data.caller_id}${data.called_did}${data.call_start}`, signature)

    return temporary_storage[data.pbx_call_id];
  },
  

  'NOTIFY_ANSWER': function NOTIFY_INTERNAL(data, signature) {

    temporary_storage[data.pbx_call_id].event.push(data.event);
    temporary_storage[data.pbx_call_id].internal = data.internal;
    temporary_storage[data.pbx_call_id].destination = data.destination;
    temporary_storage[data.pbx_call_id].dst_e164 = data.dst_e164;
    temporary_storage[data.pbx_call_id].verify = verify_data(`${data.caller_id}${data.destination}${data.call_start}`, signature);

    return temporary_storage[data.pbx_call_id];
  },

  'NOTIFY_RECORD': function NOTIFY_RECORD(data, signature) {

    temporary_storage[data.pbx_call_id].event.push(data.event);
    temporary_storage[data.pbx_call_id].call_id_with_rec = data.call_id_with_rec;
    temporary_storage[data.pbx_call_id].verify = verify_data(`${data.pbx_call_id}${data.call_id_with_rec}`, signature);

    return temporary_storage[data.pbx_call_id]
  },
  'SMS': function SMS(data, signature) {

    const result = JSON.parse(data.result);

    return {
      event: data.event,
      verify: verify_data(`${data.result}`, signature),
      from: result.caller_id,
      to: result.caller_did,
      text: result.text,
      caller_id: result.caller_id,
      caller_did: result.caller_did
    };
  },
  'NOTIFY_IVR': function NOTIFY_IVR(data, signature) {
    data.verify = verify_data(`${data.caller_id}${data.called_did}${data.call_start}`, signature);
    return data
  },
  'SPEECH_RECOGNITION': function NOTIFY_IVR(data, signature) {
    //the verify method for SPEECH_RECOGNITION is not described in the documentation
    //data.verify = verify_data(`${data.result}`, signature);
    return data
  },
  'NUMBER_LOOKUP': function NOTIFY_IVR(data, signature) {
    data.verify = verify_data(`${data.result}`, signature);
    return data
  },
  'CALL_TRACKING': function NOTIFY_IVR(data, signature) {
    data.verify = verify_data(`${data.result}`, signature);
    return data
  }
}

let temporary_storage = {};
const user_handlers = {};

const zadarma_express_handler = async function zadarma_express_handler(req, res) {
  if (!verify_ip(req)) {
    return res.end()
  }

  if (Object.keys(req.query).length) {
    req.body = req.query;
  } else {
    req.body = await parse_incoming_data_to_body_obj(req);
  }

  if (check_zd_echo(req)) {
    //zadarma api performance check
    console.log('the api zadarma checks the un with an echo request');
    return res.end(req.body.zd_echo);
  }
  
  const response_from_zadarma = handlers[req.body.event](req.body, req.headers.signature);

  if (typeof user_handlers[req.body.event] === 'function') {
    return user_handlers[req.body.event](response_from_zadarma, res);
  }
}

zadarma_express_handler.on = function on(event_name, user_callback_function) {
  if (!zadarma_events_list.includes(event_name)) {
    throw new Error('an unknown event handler is set, set handler from the list:\n' +
      zadarma_events_list.join(',\n')
    );
  }
  user_handlers[event_name] = user_callback_function;
}

zadarma_express_handler.clear_temporary_storage = function clear_temporary_storage(id) {
  if (id) {
    delete temporary_storage[id]
  } else {
    temporary_storage = {};
  }
}

zadarma_express_handler.get_temporary_storage = function get_temporary_storage() {
  return temporary_storage;
}

module.exports = zadarma_express_handler;
