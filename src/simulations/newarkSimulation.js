
const config = require('../config');
const redis = require("redis");
const simulation = require('./newarkSimulatitonData');

const pub = redis.createClient(config.port, config.host);

const client = redis.createClient(config.port, config.host);
const multi = client.multi();


let number=2;
// insertData();
setInterval(()=>{
    if ( number >= 8){
        number=0;
        console.log("end loop of temp");
    }
    else {
        publisher(number);
        number+=2;
    }
},config.updateIntervalMs);



function insertData() {

    client.exists("new", function(err, reply) {
        if (reply === 1) {
           return true;
        } else {
            simulation.forEach(simulationFlight => {
                let newData = JSON.stringify(simulationFlight);
                multi.rpush("new",newData);
            });
            multi.exec((err,results) => {})
        }
    });
    console.log("data inserted");
}


function publisher(num) {
    let allFlights = [] ;
    client.lrange( "new", num, num+1, (err, chunks) => {
        // console.log("initial data!");
        chunks.forEach(chunk => {
            allFlights.push(chunk);
        });
        let dataPublisher = `{"messageAdded":[ ${allFlights}]}`;
        console.log(dataPublisher);
        pub.publish(config.CHANNEL, dataPublisher);
    });
}



