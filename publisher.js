const redis = require("redis");
pub = redis.createClient(6379, '127.0.0.1');
var datacli = redis.createClient(6379, '127.0.0.1');

const config = {
    updateIntervalMs: 20000,
};

const CHANNEL = 'messageAdded';
const KEY = 'onAir';

const NUMBER_OF_LOOPS = 15;
const START = 0;
const END = 0;




function publisher(num) {
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

//Read data from Redis Db and publish on the chanel.
//loop OR interval.
let x=0;
// setInterval(()=>{publisher()},20000);
let timer =  setInterval(()=>{
    if (x>NUMBER_OF_LOOPS){
        clearInterval(timer);
        console.log("END LOOP");
    }
    else {
        publisher(x);
        x++;
    }
},config.updateIntervalMs);

// publisher();


