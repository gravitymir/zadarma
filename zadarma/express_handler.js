
const verify_ip = function verify_ip(req){
  return ip === '185.45.152.42' === (req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress.split(':').pop());
}

const zd_echo = function zd_echo(req, res){
  if(req?.query?.zd_echo){
    //zadarma api performance check
    console.log('the api zadarma checks the un with an echo request');
    res.end(req.query.zd_echo);
    return true;
  }
  return;
}


class ZadarmaHandler{

  #notify_start(){
    
  }
  NOTIFY_START(){

  }

  async handler(req, res){
    if(!this.#verify_ip()){
      res.end();
    } else if (req?.query?.zd_echo) {
      
    }
  }




}

module.exports = async function zadarma_express_handler(req, res, next) {

  let ip = req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress.split(':').pop();

  /*
  ip zadarma service
  https://my.zadarma.com/api/#apitab-zcrm
  from the bottom of the page
  */

  //http://164.90.214.160:8080/zadarma

  if (ip !== '185.45.152.42') {
    return res.end();
  } else if (req.query?.zd_echo) {
    //zadarma api performance check
    console.log('the api zadarma checks the un with an echo request');
    return res.end(req.query.zd_echo);
  }

  console.log(req.headers.signature)
  console.log(req.body);
  
  

  

  // console.log(ip);
  // console.log(req.headers);
  // console.log(req.connection.remoteAddress);

  // console.log(req.params);
  // console.log(req.query);
  // console.log(req.statusMessage);
  // console.log(req.statuscode);
  // console.log(req?.body?.result)

  res.end('end');
}