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
    //console.log(await zadarma.pbxInternalStatus(100));

    //error put
    // console.log(await zadarma.pbxInternalOnOffRecording({
    //     id: 100,
    //     status: 'on',
    //     email: ''
    // }));

    //error put
    // console.log(await zadarma.smsSend({
    //     number: '380989897908',
    //     message: 'test text'
    // }));
    //console.log(await zadarma.statisticsPbx(100));
}
)();
;


let o = {
    values: [9,8,7,6,5,4,3,2,1],
    [Symbol.iterator](){
        let i = 0;
        return {
            next: () => {
                const value = this.values[i];
                i++
                return {
                    done: i > this.values.length,
                    value
                }
            }
        }
    }
}


for (let item of o){
    console.log(item);
}


const str = 'asdasd';
console.log(str.startsWith('as'));
console.log(str.endsWith('d'));

console.log(str.includes('d'));

console.log([1,2,3].includes(2));
console.log('asd'.repeat(2));
console.log('asd'.padStart(6, 'asd'));


console.log(' asd '.trim(2));
console.log(' asd '.trimStart(2));


function abc(arr){
    return arr.reduce((acc, i) => {
        return acc += i
    }, 0) / arr.length
}

console.log(abc([10,20,30,40]));

let s = {
    s: 10
}

let a = s;

console.log(Object.is(s, a));

