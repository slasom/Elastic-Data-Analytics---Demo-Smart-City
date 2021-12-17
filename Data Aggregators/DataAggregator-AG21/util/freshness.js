'use strict';


exports.timeToMilliseconds = function(freshness){

    var double = freshness.match(/\d+/)[0]; // replace all leading non-digits with nothing

    switch(true){
        case (freshness.includes('s')):
            //Are seconds
            double=double*1000;
        break;
        case (freshness.includes('m')):
            //Are minutes
            double=double*60000;
        break;
        case (freshness.includes('h')):
            //Are hours
            double=double*3600000;
        break;
        default:
            console.log("nothing")
    }

    

    //console.log(double)
   
    return double;

}