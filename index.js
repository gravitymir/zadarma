require("./process.env.js");
const {api} = require("./zadarma");
const {api: z_api} = require("./zadarma");

(async function(){
    let response;
    response = await z_api({api_method: '/v1/info/balance/'});
    console.log(response);
    response = await z_api({api_method: '/v1/info/timezone/'});
    console.log(response);
    response = await z_api({api_method: '/v1/zcrm/customers'});
    console.log(response);

    
    // response = await z_api({api_method: '/v1/zcrm/events'});
    // console.log(response);

    // response = await z_api({
    //     http_method: 'post',
    //     api_method: '/v1/zcrm/customers/labels',
    //     params: {
    //         name: 'new tag'
    //     }

    // });
    // console.log(response);




    response = await z_api({
        http_method: 'post',
        api_method: '/v1/zcrm/customers/labels',
        params: {
            "name": "new 2 name company",
            "status": "company",
            "type": "client",
            "responsible_user_id": 20,
            "employees_count": "50",
            "comment": "",
            "country": "GB",
            "city": "London",
            "address": "",
            "zip": "",
            "website": "",
            "lead_source": "manual",
            "phones": [
            {
                "type": "work",
                "phone": "+44123456789"
            }
            ],
            "contacts": [
            {
                "type": "email_work",
                "value": "good_company@example.com"
            }
            ],
            "labels": [
                {"id": 99938}
            ],
            "custom_properties": [
            {
                "id": 18,
                "value": "high"
            }
            ]
        }
    });
    
    console.log(response);
    
    /*
    api_user_key = process.env.ZADARMA_USER_KEY,
    api_secret_key = process.env.ZADARMA_SECRET_KEY

    response = await z_api({
        api_method: '/v1/request/callback/',
        params: {
            from: '73919100000',
            to: '67200000000',
            sip: '100',
            predicted: 'predicted'
        }
    });
    console.log(response);

    */
   /*
    response = await z_api({
        http_method: 'post', 
        api_method: '/v1/sms/send/',
        params: {
            caller_id: '73919100000',
            number: '67200000000',
            message: 'test sms 0987654321 тестовое смс'
        }
    });
    console.log(response);
    */
    /*

    response = await z_api({api_method: '/v1/info/timezone/'});
    console.log(response);

    process.env.ZADARMA_USER_KEY = 'a248a6a984459935b569';
    process.env.ZADARMA_SECRET_KEY = '8a8e91d214fb728889c7';
    response = await z_api({api_method: '/v1/sip/'});
    console.log(response)

    //multi account use
    response = await z_api({
        api_method: '/v1/tariff/',
        api_user_key: 'a248a6a984459935b569', 
        api_secret_key: '8a8e91d214fb728889c7'
    });
    console.log(response);

    let sip_number = '886493';

    response = await z_api({api_method: '/v1/sip/${sip_number}/status/'});
    console.log(response);

    response = await z_api({api_method: '/v1/direct_numbers/'});
    console.log(response);

    response = await z_api({api_method: '/v1/zcrm/customers'});
    console.log(response);

    response = await z_api({
        http_method: 'dalete',
        api_method: '/v1/zcrm/customers/c_id',
        params: {
            c_id: '1111111'
        }
    });
    console.log(response)

    response = await z_api({
        //http_mathod: 'get', [default]
        api_method: '/v1/info/price/',
        params: {
            number: '67200000000',
            caller_id: '73919100000'
        }
    });
    console.log(response);
    */
}
)();
;
