const redis = require("redis");
pub = redis.createClient(6379, '127.0.0.1');
var datacli = redis.createClient(6379, '127.0.0.1');


const CHANNEL2 = 'messageAdded';
const KEY = 'test';

//Read data from Redis Db and publish on the chanel.
//loop OR interval.
datacli.lrange( KEY, 0, 600, (err, chunks) => {
    console.log("initial data!");
    chunks.forEach(chunk => {
        // console.log( typeof chunk);

          // console.log(`temp: ${chunk}`);
        // predata = {id: `${num}`,content: "Hello Redis"};
        // predata= `{ "icao24": "aa56da", "callsign": "UAL500"}}`;

        data = `{"messageAdded": ${chunk}}`;
        console.log (data);
        pub.publish(CHANNEL2, data);
    })
});


// PUBLISH "messageAdded" '{"messageAdded": {"icao24": "aa56da", "callsign": "UAL500"}}'


