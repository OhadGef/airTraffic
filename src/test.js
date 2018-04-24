// const redis = require('redis');
//
// const client = redis.createClient(config.port, config.host);
//
// function waitForPush () {
//     client.brpop(['jfk1','otherlist',0], function (listName, item) {
//         // do stuff
//         waitForPush();
//     });
// }
let allFlights = [];
let x=0;
allFlights.push({'test1':1})
allFlights.push({'test2':2})
allFlights.shift()

console.log(allFlights);