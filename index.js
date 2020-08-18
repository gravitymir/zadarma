require("./process.env.js");
const zadarma = require("./v1/index.js");


(async function(){
    //console.log(zadarma);
    
    // console.log(await zadarma.infoBalance());
    // console.log(await zadarma.infoPrice({to: 67200000000}));
    // console.log(await zadarma.infoTimezone());
    // console.log(await zadarma.tariff());

    // console.log(await zadarma.requestCallback({
    //     from: '380947102794',
    //     to: '380989897908',
    //     sip: 100,
    //     predicted: true
    
    // }));

    //console.log(await zadarma.sip());
    //console.log(await zadarma.sipStatus('990126'));


    //error put
    // console.log(await zadarma.sipChangeCallerId({
    //     id: '886493',
    //     number: your number
    // }));

    //console.log(await zadarma.sipRedirection('990126'));
    //console.log(await zadarma.directNumbers());

    //error put
    // console.log(await zadarma.sipOnOffRedirection({
    //     id: '886493',
    //     status: 'off'
    // }));

    //error put
    // console.log(await zadarma.sipChangeRedirection({
    //     id: '886493',
    //     type: 'phone',
    //     number: 'off'
    // }));

    //console.log(await zadarma.pbxInternal());
    console.log(await zadarma.pbxInternalStatus(100));

    //error put
    // console.log(await zadarma.pbxInternalOnOffRecording({
    //     id: 100,
    //     status: 'on',
    //     email: ''
    // }));

    console.log(await zadarma.smsSend({
        number: '380989897908',
        message: 'test text'
    }));
    //console.log(await zadarma.statisticsPbx(100));
}
)();
;
