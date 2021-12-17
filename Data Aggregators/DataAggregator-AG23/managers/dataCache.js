'use strict';

//TODO: Change the type of result variable if it's necessary
var resultRequest=[];



exports.insertData = function (analyticID, result){

    if(resultRequest.length>0){
        for(let val of resultRequest) {
            if(val.analyticID==analyticID){
                //val.content.push(result)
                val.content=result;
                break;
            }
        }
    }
}



// exports.getResult = function(id,method,params){
//     var res =  returnResults(id);

//     if (res.length==0)
//         return []

//     deleteRequest(id)

//     return res;

// }


exports.stopAll = function (){


    resultRequest.forEach(analytic=>{   
        clearInterval(analytic.timer_id);
    })
    
}


exports.updateTimerId = function(id,timer_id){
    
    for(let val of resultRequest) {
        if(val.analyticID==id){
            val.timer_id=timer_id;
        }
    }
}

exports.getTimerId = function(id){
    
    for(let val of resultRequest) {
        if(val.analyticID==id){
            return val.timer_id
        }
    }
}
exports.existAnalytic = function(id){
    if(resultRequest.length>0){
        for(let val of resultRequest) {
            if(val.analyticID==id){
                return true;
            }
        }
        return false;
    }
        return false;

}

exports.createAnalytic = function(id, timer_id){
    var schema={analyticID: id, timer_id: timer_id, content:[]}

    resultRequest.push(schema)
}

function deleteRequest(id){
    resultRequest = resultRequest.filter(function(item){
        return item.idRequest !== id;
    });
}

exports.returnResults=function (analyticID){
    if(resultRequest.length>0){
        for(let val of resultRequest) {
            if(val.analyticID==analyticID){
                return val.content
            }
        }

        return []

    }else
        return []
}