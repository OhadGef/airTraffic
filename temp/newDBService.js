/*
 pushing data from opensky-network API to Redis DB as a list.
*/
const redis = require('redis');
const config = require('../src/config');
const fetch = require('node-fetch');
const client = redis.createClient(config.port, config.host);
const cl = redis.createClient(config.port, config.host);

// Seting the data in redis

const multi = client.multi();
console.log(`******************************************`);
console.log(`DB service`);
console.log(`redis host env: ${process.env.REDIS_HOST}`);
console.log(`redis port env: ${process.env.REDIS_PORT}`);
console.log(`redis channel env: ${process.env.CHANNEL}`);
console.log(`redis simulation key env: ${process.env.REDIS_SIMULATION_KEY}`);
console.log(`redis key env: ${process.env.REDIS_KEY}`);
console.log(`******************************************`);

const options = {
    url: config.api,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};

let data = [] ;

setInterval(()=>{getData()},config.setIntervalMs);

//  ***Getting flights from api.***
function getData (){
    fetch(config.api)
        .then(res => res.json())
        .then(temp => {
            console.log(`Getting data from API.`);
            temp.states.forEach(
                x => {
                    if ( x[5]  !== null ||
                        x[6]  !== null ||
                        x[6]  !== null && x[5] !== null ) // Take only flights that have position Values.
                    {
                        data = {
                            icao24: x[0],
                            longitude: x[5] !== null? JSON.stringify(x[5]) : '0.00' ,
                            latitude: x[6] !== null? JSON.stringify(x[6]) : '0.00' ,
                            geo_altitude: x[7] !== null? JSON.stringify(x[7]) : '5.55' ,
                            // on_ground: JSON.stringify(x[8]),
                            velocity: x[9] !== null? JSON.stringify(x[9]) : '0.00' ,
                            heading: x[10] !== null? JSON.stringify(x[10]) : '0.00' ,
                        };
                        let newData = JSON.stringify(data);
                        multi.rpush(config.KEY,newData);
                        // console.log(newData);
                    }
                    else {
                        // console.log(`${x[0]}null`)
                    }
                });
            console.log("end");


        })
        .then(clearKeyData())
        .then(sendData());
}


function clearKeyData() {
    return client.exists(config.KEY, function(err, reply) {
        if (reply === 1) {
            client.del(config.KEY, function(err, reply) {
                if(err){
                    console.error(err);
                }
                console.log(`The KEY: ${config.KEY} was deleted`);
                return true;
            });
            const cleanList = () => {
                cl.brpop([config.KEY, 'otherlist', 0], (listName, item) => {
                    cleanList();
                });
                return true;
            }
        } else {
            console.log(`The KEY: ${config.KEY} doesn\'t exist`);
            return true;
        }
    });
    return true;
}

function sendData() {
    console.log(`Injecting new data to Redis.`);
    multi.exec((err,results) => {
        if(err){
            console.error(err);
        }
        // console.log(`exec:${results}`);
    });
}


