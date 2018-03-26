const redis = require("redis");
pub = redis.createClient(6379, '127.0.0.1');
var datacli = redis.createClient(6379, '127.0.0.1');


const CHANNEL = 'messageAdded';
const KEY = 'onAir';
const START = 0;
const END = 4;
//

//Read data from Redis Db and publish on the chanel.
//loop OR interval.
setInterval(()=>{publisher()},30000);

function publisher() {
    let allFlights = [] ;
    datacli.lrange( KEY,START,END, (err, chunks) => {
        console.log("initial data!");
        chunks.forEach(chunk => {
            allFlights.push(chunk);
        });
        dataPublisher = `{"messageAdded":[ ${allFlights}]}`;
        console.log(dataPublisher);
        pub.publish(CHANNEL, dataPublisher);
    });

}

