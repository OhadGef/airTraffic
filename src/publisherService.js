const redis = require("redis");
const config = require('./config');
const pub = redis.createClient(config.port, config.host);
var datacli = redis.createClient(config.port, config.host);

console.log(`******************************************`);
console.log(`start PubSub service.`);
console.log(`redis host env: ${process.env.REDIS_HOST}`);
console.log(`redis port env: ${process.env.REDIS_PORT}`);
console.log(`redis channel env: ${process.env.CHANNEL}`);
console.log(`redis simulation key env: ${process.env.REDIS_SIMULATION_KEY}`);
console.log(`redis key env: ${process.env.REDIS_KEY}`);
console.log(`******************************************`);

let x=0;
let allFlights = [];

let timer =  setInterval(()=>{
    if (x>config.NUMBER_OF_LOOPS){
        clearInterval(timer);
        console.log("END LOOP");
        console.log(allFlights);
    }
    else {
        publisher();
        x++;
    }
},config.updateIntervalMs);

function publisher() {
    let tempFlights = [];
    console.log(`Publisher is running on channel ${config.CHANNEL} ...`);
    datacli.lrange( config.KEY,config.START,config.END, (err, chunks) => {
        console.log("initial data!");
        if(err){
            console.error(err);
        }
        else {
            chunks.forEach(chunk => {
                tempFlights.push(chunk);
            });
            if (allFlights.length>1){
                allFlights.shift();
                allFlights.push(`skyPicture: ${chunks}`);
            }
            else {
                allFlights.push(`skyPicture: ${chunks}`);
            }
        }

        dataPublisher = `{"messageAdded":[ ${tempFlights}]}`;
        if (tempFlights.length>0){
            pub.publish(config.CHANNEL, dataPublisher);
            console.log(dataPublisher);
        }
        else {
            console.log("//");
        }
    });
}






