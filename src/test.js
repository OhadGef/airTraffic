var diffParams = {};
var obj1 = [{"icao24":"a9607d","longitude":"-86.1093","latitude":"33.1724","geo_altitude":"11277.6","velocity":"253.3","heading":"71.53"}]
    obj2 = {"a":"1", "b":"66", "c":[{"key":"55"}]};

for( var p in obj1 ){
    if ( !compareValue(obj1[p], obj2[p]) ){
        diffParams[p] = obj1[p];
    }
}

function compareValue(val1, val2){
    var isSame = true;
    for ( var p in val1 ) {

        if (typeof(val1[p]) === "object"){
            var objectValue1 = val1[p],
                objectValue2 = val2[p];
            for( var value in objectValue1 ){
                isSame = compareValue(objectValue1[value], objectValue2[value]);
                if( isSame === false ){
                    return false;
                }
            }
        }else{
            if(val1 !== val2){
                isSame = false;
            }
        }
    }
    return isSame;
}
console.log(diffParams);