const fetch = require('node-fetch');
const redis = require('redis');
const client = redis.createClient();
const cl = redis.createClient();

const multi = client.multi();
const KEY = 'onAir';


function injectDataToRedis() {
    fetch('https://com:hEYZaVPXdn@opensky-network.org/api/states/all')
        .then(res => res.json())
        .then(async json => {
            console.log(typeof json);
            const temp = json;
            temp.states.forEach(
                x => {
                    if (x[5] !== null ||
                        x[6] !== null ||
                        x[6] !== null && x[5] !== null) // Take only flights that have position Values.
                    {
                        data = {
                            icao24: x[0],
                            longitude: x[5] !== null ? JSON.stringify(x[5]) : '0.00',
                            latitude: x[6] !== null ? JSON.stringify(x[6]) : '0.00',
                            geo_altitude: x[7] !== null ? JSON.stringify(x[7]) : '0.00',
                            velocity: x[9] !== null ? JSON.stringify(x[9]) : '0.00',
                            heading: x[10] !== null ? JSON.stringify(x[10]) : '0.00',

                        };
                        let newData = JSON.stringify(data);
                        multi.rpush(KEY, newData);
                    }
                    else {
                        // console.log(`${x[0]}null`)
                    }
                });
            console.log("end");
        })
        .then(()=> clearKeyData())
        .then(() => sendData())
}

function clearKeyData() {
    return cl.exists(KEY, function(err, reply) {
        if (reply === 1) {
            cl.del(KEY, function(err, reply) {
                console.log(`The KEY: ${KEY} was deleted`);
                return true;
            });
        } else {
            console.log(`The KEY: ${KEY} doesn\'t exist`);
            return true;
        }
    });
    // return true;
}


function sendData() {
    console.log(`Injecting new data to Redis.`);
    multi.exec((err,results) => {
        // console.log(results);
    });
}
setInterval(()=> {injectDataToRedis()},10000);