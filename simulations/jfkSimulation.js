
const config = require('../src/config');
const redis = require("redis");
const simulation = require('./JFKSimulationData');

const pub = redis.createClient(config.port, config.host);

const client = redis.createClient(config.port, config.host);
const multi = client.multi();

// console.log(`******************************************`);
// console.log(`start JFK temp.`);
// console.log(`redis host env: ${process.env.REDIS_HOST}`);
// console.log(`redis port env: ${process.env.REDIS_PORT}`);
// console.log(`redis channel env: ${process.env.CHANNEL}`);
// console.log(`redis temp key env: ${process.env.REDIS_SIMULATION_KEY}`);
// console.log(`redis key env: ${process.env.REDIS_KEY}`);
// console.log(`******************************************`);

let number=3;
insertData();
// setInterval(()=>{
//     if ( number >= 17){
//         number=0;
//         console.log("end loop of temp");
//     }
//     else {
//         publisher(number);
//         number+=3;
//     }
// },config.updateIntervalMs);



function insertData() {

    client.exists(config.SIMULATION_KEY, function(err, reply) {
        if (reply === 1) {
           return true;
        } else {
            simulation.forEach(simulationFlight => {
                let newData = JSON.stringify(simulationFlight);
                multi.rpush(config.SIMULATION_KEY,newData);
            });
            multi.exec((err,results) => {
            })
        }
    });
    console.log("data inserted");
}


function publisher(num) {
    let allFlights = [] ;
    client.lrange( config.SIMULATION_KEY, num, num, (err, chunks) => {
        // console.log("initial data!");
        chunks.forEach(chunk => {

            allFlights.push(chunk);
        });
        let dataPublisher = `{"messageAdded":[ ${allFlights}]}`;
        console.log(dataPublisher);
        pub.publish(config.CHANNEL, dataPublisher);
    });
}



