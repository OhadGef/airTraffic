/*
 pushing data from opensky-network API to Redis DB as a list.
*/

const request = require('request');
const redis = require('redis');
const client = redis.createClient();
const cl = redis.createClient();

// Seting the data in redis



// client.on('connect', function () {
//     console.log('connected');
// });
//
const multi = client.multi();

const KEY = 'onAir';

const options = {
    // url: 'https://opensky-network.org/api/states/all?time=1458564121&icao24=3c6444',
    url: 'https://com:hEYZaVPXdn@opensky-network.org/api/states/all',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};

let data = [] ;


//  ***Getting flights from api.***
function getData (){
    request(options, function (err, res, body) {
        if (err){ console.error(err)}
        console.log(`Getting data from API.`);
        const temp = JSON.parse(body);

        temp.states.forEach(
            x => {
                if ( x[5]  !== null ||
                     x[6]  !== null ||
                     x[6]  !== null && x[5] !== null ) // Take only flights that have position Values.
                {
                    data = {
                        icao24: x[0],
                        // callsign: x[1].trim(),
                        // origin_country: x[2],
                        // time_position:  JSON.stringify(x[3]),
                        // last_contact: JSON.stringify(x[4]),
                        longitude: x[5] !== null? JSON.stringify(x[5]) : '0.00' ,
                        latitude: x[6] !== null? JSON.stringify(x[6]) : '0.00' ,
                        geo_altitude: x[7] !== null? JSON.stringify(x[7]) : '0.00' ,
                        // on_ground: JSON.stringify(x[8]),
                        velocity: x[9] !== null? JSON.stringify(x[9]) : '0.00' ,
                        heading: x[10] !== null? JSON.stringify(x[10]) : '0.00' ,
                        // vertical_rate: JSON.stringify(x[11]),
                        // sensors: x[12],
                        // baro_altitude: JSON.stringify(x[13]),
                        // squawk: JSON.stringify(x[14]),
                        // spi: JSON.stringify(x[15]),
                        // position_source: JSON.stringify(x[16])
                    };
                    let newData = JSON.stringify(data);
                    multi.rpush(KEY,newData);
                    // console.log(newData);
                }
            else {
                    // console.log(`${x[0]}null`)
                }
            });
        console.log("end");
    });
}

setInterval(()=>{getData(),
    setTimeout(()=>{ clearKeyData();
                        sendData()},10000)
},20000);

// getData();
// setTimeout(()=>{sendDAta()}, 5000);

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


