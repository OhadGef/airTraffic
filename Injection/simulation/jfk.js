const redis = require("redis");
pub = redis.createClient(6379, '127.0.0.1');
var datacli = redis.createClient(6379, '127.0.0.1');

const config = {
    updateIntervalMs: 20000,
}
const CHANNEL = 'messageAdded';
const KEY = 'jfk';

const NUMBER_OF_LOOPS =17;

function publisher(num) {
    let allFlights = [] ;
    datacli.lrange( KEY, num, num, (err, chunks) => {
        console.log("initial data!");
        chunks.forEach(chunk => {
            allFlights.push(chunk);
        });
        dataPublisher = `{"messageAdded":[ ${allFlights}]}`;
        console.log(dataPublisher);
        pub.publish(CHANNEL, dataPublisher);
    });
}

let x=1;

let timer =  setInterval(()=>{
    if (x>NUMBER_OF_LOOPS){
        clearInterval(timer);
        console.log("END LOOP");
    }
    else {
        publisher(x);
        x+=1;
    }
},config.updateIntervalMs);

