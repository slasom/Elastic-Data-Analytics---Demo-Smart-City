'use strict';

//DEFAULT LOAD
const vars = require('./index');
var mqttApp = vars.mqttApp;
var orchestrator=[];

var orchestratorV2=[];

var architecture=new Map();

var analytics=new Map();

const maxLevel=2;

var leafs=6

architecture.set("DA0", { level:0, sons: ["DA1","DA2"]});
architecture.set("DA1", { level:1, sons: ["DA11","DA12","DA13"]});
architecture.set("DA2", { level:1, sons: ["DA21","DA22","DA23"]});
architecture.set("DA11", { level:2, sons: []});
architecture.set("DA12", { level:2, sons: []});
architecture.set("DA13", { level:2, sons: []});
architecture.set("DA21", { level:2, sons: []});
architecture.set("DA22", { level:2, sons: []});
architecture.set("DA23", { level:2, sons: []});



orchestratorV2.push({id:"DA0",level:0, analytics:[]})
orchestratorV2.push({id:"DA1",level:1, analytics:[]})
orchestratorV2.push({id:"DA2",level:1, analytics:[]})
orchestratorV2.push({id:"DA11",level:2, analytics:[]})
orchestratorV2.push({id:"DA12",level:2, analytics:[]})
orchestratorV2.push({id:"DA13",level:2, analytics:[]})
orchestratorV2.push({id:"DA21",level:2, analytics:[]})
orchestratorV2.push({id:"DA22",level:2, analytics:[]})
orchestratorV2.push({id:"DA23",level:2, analytics:[]})



function insertAnalytic (content){



    switch(content.analytic.accuracy){
        case "LOW":
            analytics.set(content.analytic.analyticID, {analyticID:content.analytic.analyticID, frequency: content.analytic.freshness, distribution: 0.2, body: content.body})
            break;

        case "MEDIUM":
            analytics.set(content.analytic.analyticID, {analyticID:content.analytic.analyticID, frequency: content.analytic.freshness, distribution: 0.5, body: content.body})
            break;

        case "HIGH":
            analytics.set(content.analytic.analyticID, {analyticID:content.analytic.analyticID, frequency: content.analytic.freshness, distribution: 1, body: content.body})
            break;
    }
    

   

}

exports.calculateAnalytic = function(content){

    //console.log(analytic)
    
    //Insert to analytics array
    insertAnalytic(content)

    //Reset distribution
    console.log("Reset orchestrator")
    resetOrchestrator()

   
    //Redistribute analytics
    //distributeAnalytics()

    distributeAnalyticsV2()


    console.log("Architecture status")
     console.log(orchestratorV2)

	showOrchestrator()

 

    // console.log("Distribution Coeficient")
    // analytics.forEach(function(value, key){

    //     console.log(" Analytic "+key)
    //     console.log(getDistributionCoeficient(key))
    // })
    
}


exports.deleteAnalytic = function(id){


        console.log("DELETED")
        analytics.delete(parseInt(id))
    
        //Reset distribution
        console.log("Reset orchestrator")
        resetOrchestrator()
    
       
        //Redistribute analytics
        //distributeAnalytics()
    
        distributeAnalyticsV2()
    
        
    
        console.log("Architecture status")
         console.log(orchestratorV2)

	showOrchestrator()


}


exports.sendAnalytics = function(){

    console.log("Send analytics")


    // //TODO: POST SETUP TO ALL AGGREGATOR 
    // orchestratorV2.forEach(aggregator => {
        

    //     aggregator.analytics.forEach(analytic=> {

    //         console.log(aggregator.id)
    //         console.log(analytics.get(analytic))

    //         mqttApp.publish("HeatmapAggregator/"+aggregator.id+"/setup", JSON.stringify(analytics.get(analytic)));

    //     })


    //     //mqttApp.publish("HeatmapAggregator/"+element.id+"/setup", JSON.stringify(valuesReq));
    // });


    orchestratorV2.forEach(aggregator => {
        

        
        //console.log(aggregator.id)
        

        var lAnalytics=[]

        aggregator.analytics.forEach(analytic=> {

            // console.log(aggregator.id)
            // console.log(analytics.get(analytic))
            lAnalytics.push(analytics.get(analytic))

        
        })

        //console.log(lAnalytics)

        mqttApp.publish("HeatmapAggregator/"+aggregator.id+"/setup", JSON.stringify(lAnalytics));
        //mqttApp.publish("HeatmapAggregator/"+aggregator.id+"/setup", JSON.stringify(aggregator.analytics));

        //mqttApp.publish("HeatmapAggregator/"+element.id+"/setup", JSON.stringify(valuesReq));
    });
}



function distributeAnalytics (){


    var lAnalytics=new Map(analytics)

    

    orchestratorV2.forEach(value=>{

        //console.log("AGREGADOR: "+value.id)

        //Insert from original analytic list
        if(value.id=="AG0"){
            lAnalytics.forEach(function(element, analyticID, map){
                //value.analytics.set(analyticID, {frequency: element.frequency, distribution: element.distribution})
                value.analytics.push(analyticID)
            })
            
        }

        var sons=architecture.get(value.id).sons
        console.log(sons.length)
        if(sons.length>0){

            var analyticsFromAggregator= value.analytics.slice()

            var result = Math.floor(analyticsFromAggregator.length/sons.length)
            var remaining = analyticsFromAggregator.length % sons.length

            // console.log("analytics to insert to each aggregator->" +analyticsFromAggregator.length +"/"+sons.length+"="+result)
            // console.log("remaining to insert->" +remaining)
            

            //if there are fewer analytics than nodes in the level, the analytics are inserted in all the nodes
            if(result==0){
                result=sons.length
                remaining=0

                analyticsFromAggregator.forEach(analyticID=>{

                    sons.forEach(son=>{
                        const index = getIndexOfAggregator(son)
                        orchestratorV2[index].analytics.push(analyticID)
                    
                    })
                    
                })

            }else{
                //Distribute the analytics across the nodes
                
                for (let i = 1; i <= sons.length; i++) {

                    var extra = (i <= remaining) ? 1:0;

                   
                    var arrayResult=[]

                    if(analyticsFromAggregator.length != (result+extra))
                        arrayResult= getAnalytics(analyticsFromAggregator,(result + extra))
                    else
                        arrayResult=analyticsFromAggregator

                    arrayResult.forEach(element=>{
                        const index = getIndexOfAggregator(sons[i-1])
                        //orchestratorV2[index].analytics.set(element.id, {frequency: element.frequency, distribution: element.distribution})
                        orchestratorV2[index].analytics.push(element)
                    })

                    
                }
            }

        }
        
    })
    
}

// LOW: 0.2
// MEDIUM: 0.5
// HIGH: 1
function distributeAnalyticsV2 (){

    console.log("Distribution V2")

    var lAnalytics=new Map(analytics)

    var maxDistribution=getMaxDistributionCoeficient();

    //console.log("maxDistribution: "+maxDistribution)
    

    lAnalytics.forEach(analytic=>{

        //console.log("ID: "+analytic.analyticID)
        //console.log("distribution: "+analytic.distribution)

        if(analytic.distribution <= maxDistribution){

            //Calculate Nodes
            var nodes= Math.floor(analytic.distribution*leafs)
            //var nodes=analytic.distribution*leafs
           // console.log("nodes:" +nodes)

            if(nodes==0)
                nodes=1


            var resultNodes=minSelectionDeepestLevel(nodes)


            // console.log("Selected nodes")
            // console.log(resultNodes)

            resultNodes.forEach(node=>{
                const index = getIndexOfAggregator(node)
                orchestratorV2[index].analytics.push(analytic.analyticID)

            })


        }else{

            var nodes2= Math.floor(maxDistribution*leafs)
            
            //var nodes= maxDistribution*leafs
            //console.log("nodes:" +nodes2)

            if(nodes2==0)
                nodes2=1

            var resultNodes=minSelectionDeepestLevel(nodes2)
            // console.log("Selected nodes")
            // console.log(resultNodes)

            resultNodes.forEach(node=>{
                const index = getIndexOfAggregator(node)
                orchestratorV2[index].analytics.push(analytic.analyticID)

            })
        }
        
    })

    for (let i = (maxLevel-1); i >= 0 ; i--) {
        
        
        var arq=searchByLevel(orchestratorV2,i)
        // console.log("ARQ")
        // console.log(arq)

        arq.forEach(agg=>{
            const index = getIndexOfAggregator(agg.id)
            var sons=architecture.get(agg.id).sons
            var resultAnalytics=[];

            sons.forEach(son=>{
                const j = getIndexOfAggregator(son)
                resultAnalytics=resultAnalytics.concat(orchestratorV2[j].analytics)
            })

            

            //ELIMINATE DUPLICATE
            resultAnalytics = resultAnalytics.filter((item,index)=>{
                return (resultAnalytics.indexOf(item) == index)
             })
             
            //  console.log("agg "+agg.id)
            //  console.log("resultAnalytics")
            // console.log(resultAnalytics)


            orchestratorV2[index].analytics=orchestratorV2[index].analytics.concat(resultAnalytics)
        })

    }

   
    
}
function showOrchestrator(){

                                     
    var show='\n                                    ['+orchestratorV2[0].id+']                                \n\
    \                                -('+orchestratorV2[0].analytics+')-                          \
    \n\
    \n\
                   ['+orchestratorV2[1].id+']                                ['+orchestratorV2[2].id+']               \n\
    \               -('+orchestratorV2[1].analytics+')-                              -('+orchestratorV2[2].analytics+')-                  \
    \n\
    \n\
         ['+orchestratorV2[3].id+']    ['+orchestratorV2[4].id+']    ['+orchestratorV2[5].id+']         ['+orchestratorV2[6].id+']    ['+orchestratorV2[7].id+']    ['+orchestratorV2[8].id+']     \n\
    \     -('+orchestratorV2[3].analytics+')-     -('+orchestratorV2[4].analytics+')-     -('+orchestratorV2[5].analytics+')-           -('+orchestratorV2[6].analytics+')-    -('+orchestratorV2[7].analytics+')-     -('+orchestratorV2[8].analytics+')-                  \
    \n\
    \n\'';
    
    console.log(show)
}


function selectAggregators(aggregator){

    var fSelected=[]
  
    var sons = architecture.get(aggregator.id).sons;
        //console.log(sons.length)

        if(sons.length>0){
            var numAggregatorsOfLevel = analytics.size/sons.length;

            //Math.floor() method rounds a number DOWNWARDS to the nearest integer, and returns the result.
            //console.log( numAggregatorsOfLevel)
            numAggregatorsOfLevel = Math.floor(numAggregatorsOfLevel)

            //Select sons aggregators
            // console.log("Sons")
            // console.log(sons)
    
            console.log("Aggregator: "+aggregator.id+" |Sons: "+sons.length+"| Analytics: "+analytics.size+" | Aggregators: "+numAggregatorsOfLevel)

            if(numAggregatorsOfLevel<1)
                numAggregatorsOfLevel=1
            
            var selected=minSelection(sons, numAggregatorsOfLevel)

            console.log("selected from min " + selected)

            //fSelected.push(selected)
            fSelected=fSelected.concat(selected)
            
            //Recursive
            
            selected.forEach(aggregator=>{
                //console.log("search for " + aggregator)

                var out=selectAggregators(searchAggregator(aggregator))

                //console.log("out "+ out)
            
                fSelected=fSelected.concat(out);

            })


        }else{

           // console.log("Fin Recursive")
            //console.log(fSelected)
            return fSelected;
        }

        return fSelected;

        
}


function getDistributionCoeficient(analytic){
    //6 leafs (level 3) = 1  distribution coeficient

    var result = orchestratorV2.filter(function(item){
        //return item.level==maxLevel && item.analytics.get(analytic)
        return item.level==maxLevel && item.analytics.includes(analytic)
    })

    return (result.length/leafs)

}

function getMaxDistributionCoeficient(){

    return ((leafs/analytics.size)/leafs)

}



function getAnalytics(array, num){

    var result=[]

    for (let i = 0; i< array.length; i++) {
       
        result.push(array[i])
        array.splice(i, 1);
        
        
        if(result.length==num){
            return result
        }
             
    }

    return result

    // for (var entry of map.entries()) {
    //     var key = entry[0],
    //      value = entry[1];
        

    //     result.push({id:key,frequency:value.frequency,distribution:value.distribution})
    //     map.delete(key)

    //     if(result.length==num)
    //         return result
    // }

    //return result

}

function resetOrchestrator(){

    orchestratorV2.forEach(element=>{

        //element.analytics=new Map()
        element.analytics=[]
    })
   
}

//Select that have minimum analytics assigned

function minSelection(sons, num){
    
    //"Copy" without reference
    var aggregators=sons.slice()
    
    console.log("MIN SELECTION -> "+num)
    console.log(aggregators)

    var minAgg=aggregators[0]
    var minSize= searchAggregator(aggregators[0]).analytics.length 
    var minIndex=0
    var actual
    var results=[]


    for (let i = 0; i < num; i++) {
        
        aggregators.forEach(function (element,index) {
            actual=searchAggregator(element).analytics.length 

            if(actual < minSize ){
                minSize=actual
                minAgg=element
                minIndex=index
            }

        });
        results.push(minAgg)

        aggregators=aggregators.splice(minIndex,1) //delete element for search next min Aggregator

       
    }
        

    return results;
    
}

//Select the nodes with the least analytics from the deepest level.
function minSelectionDeepestLevel(num){
    
    
    
    
    //console.log("MIN SELECTION -> "+num)
    

    //"Copy" without reference
    var arrayAggregators=orchestratorV2.slice()


    var minAgg;
    var minSize;
    var minIndex;

    
    var results=[]



    for (let i = 0; i < num; i++) {

    minAgg=getDeepestAggregator(arrayAggregators)
    minSize= minAgg.analytics.length 
    minIndex=arrayAggregators.indexOf(minAgg);
        
        arrayAggregators.forEach(function (element,index) {
           // actual=searchAggregator(element).analytics.length 


            if(element.analytics.length < minSize && element.level==maxLevel){
                //console.log("minnnnn")
                minSize=element.analytics.length
                minAgg=element
                minIndex=index
            }

        });
        results.push(minAgg.id)
        arrayAggregators.splice(minIndex,1)

    }
        

    return results;
    
}

function searchAggregator(aggregatorName){
    let obj= orchestrator.find(function(item) {
        return item.id==aggregatorName;
    });
    
    return obj;
}

function getDeepestAggregator(array){
    let obj= array.find(function(item) {
        return item.level==maxLevel;
    });
    
    return obj;
}

function searchByLevel(array,level){
    let obj= array.filter(function(item) {
        return item.level==level;
    });
    
    return obj;
}

function getIndexOfAggregator(aggregatorName){
    
    
    for (let index = 0; index < orchestratorV2.length; index++) {
        if(orchestratorV2[index].id==aggregatorName)
            return index;
        
    }
}




exports.updateAnalytic = function(analytic){

    //TODO: calculate distribution

    analytics.set(analytic.analyticID, {frequency: analytic.frequency, distribution: analytic.distribution})

    //TODO: returns aggregators assigned
}





exports.insertAnalyticToAll = function (analytic){

    if(orchestrator.length>0){
        for(let agg of orchestrator) {
            //TODO: CHOOSE WHAT AGGREGATOR ARE MORE EFFICIENT
            //if(agg.id==id){
                
                agg.analytics.set(analytic.analyticID, {frequency: analytic.frequency, distribution: distribution})  
            //}
        }
    }
}




//////////// UTILS ////////////






















exports.getResult = function(id,method,params){
    var res =  returnResults(id);

    if (res.length==0)
        return []

    deleteRequest(id)

    return res;

}

exports.getAll = function(){
    return orchestrator;
}


// exports.getAll = function(id,method,params){
//     var res =  returnResults(id);

//     if (res.length==0)
//         return []

//     deleteRequest(id)

//     return res;

// }

exports.createAggregator = function(id,level){
    var schema={"id":id,"level":level,"analytics":[],"frequency":"","distribution":""}
    orchestrator.push(schema)
}




function deleteRequest(id){
    resultRequest = resultRequest.find(function(item){
        return item.idRequest !== id;
    });
}

function returnResults(idRequest){
    if(resultRequest.length>0){
        for(let val of resultRequest) {
            if(val.idRequest==idRequest){
                return val.content
            }
        }

        return []

    }else
        return []
}