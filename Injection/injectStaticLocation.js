



const request = require('request');
const redis = require('redis');
const client = redis.createClient();

const multi = client.multi();

const KEY = 'test2';

const options = {
    // url: 'https://opensky-network.org/api/states/all?time=1458564121&icao24=3c6444',
    url: 'https://opensky-network.org/api/states/all',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};

let data = [] ;


//  ***Getting flights fron api.***
// setInterval( ()=> {
//     request(options, function (err, res, body) {
//         data = JSON.stringify(body);
//         client.set('airTraffic', data, (err, replay) => {
//             console.log(replay)
//         });
//     })}, 10000);
function getData (){
    request(options, function (err, res, body) {
        if (err){ console.error(err)}

        const temp = JSON.parse(body);

        temp.states.forEach(
            x => {
                data = {
                    icao24: x[0],
                    callsign: x[1].trim(),
                    origin_country: x[2],
                    time_position:  JSON.stringify(x[3]),
                    last_contact: JSON.stringify(x[4]),
                    longitude: -73.98549,
                    latitude: 40.75792,
                    geo_altitude: 100,
                    on_ground: JSON.stringify(x[8]),
                    velocity: JSON.stringify(x[9]),
                    heading: JSON.stringify(x[10]),
                    vertical_rate: JSON.stringify(x[11]),
                    sensors: x[12],
                    baro_altitude: JSON.stringify(x[13]),
                    squawk: JSON.stringify(x[14]),
                    spi: JSON.stringify(x[15]),
                    position_source: JSON.stringify(x[16])
                };
                let newData = JSON.stringify(data);
                multi.rpush(KEY,newData);
                // console.log(newData);
            });
    });
}
getData();

setTimeout(()=>{sendDAta()}, 5000);


function sendDAta() {
    console.log("end");
    multi.exec((err,results) => {
        // console.log(results);
    })
    // client.quit()
}
