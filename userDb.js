var jsondiffpatch = require('jsondiffpatch'),
	fuzzer = require('fuzzer'),
	Mock = require('mockjs'),
	fs = require('fs'),
	users = [];
var grammar, size, probability, loopTimes, algorithm;
var smallGrammar = {
    'father|1-1': [{
	 'id|+1': 1,
         "married|1" : true,
         "name" : "@FIRST @LAST",
	 "sons" : null,
	 "daughters|3-3" : [ 
	     { 
		  "age|0-31" : 0,
		  "name" : "@FIRST"
	     }
	 ]
    }],

    'string|1-10': '*'
};

var mediumGrammar = {
    'father|20-20': [{
	 'id|+1': 1,
         "married|1" : true,
         "name" : "@FIRST @LAST",
	 "sons" : null,
	 "daughters|3-3" : [ 
	     { 
		  "age|0-31" : 0,
		  "name" : "@FIRST"
	     }
	 ]
    }],

    'string|1-10': '*'
};

var largeGrammar = {
    'father|10000-10000': [{
	 'id|+1': 1,
         "married|1" : true,
         "name" : "@FIRST @LAST",
	 "sons" : null,
	 "daughters|3-3" : [ 
	     { 
		  "age|0-31" : 0,
		  "name" : "@FIRST"
	     }
	 ]
    }],

    'string|1-10': '*'
};

//get the parameters 
// var size = process.argv.slice(2)[0];
// var probability = process.argv.slice(3)[0];
// var loopTimes = process.argv.slice(4)[0];
// var algorithm = process.argv.slice(5)[0];

// switch (size) {
// 	case "small": grammar = smallGrammar; break;
// 	case "medium": grammar = mediumGrammar; break;
// 	case "large": grammar = largeGrammar; break;
// }


exports.findUser = function(req, res){
	console.log("==========================");
	console.log(req.query);

    size = req.query.size;
    probability = req.query.probability;
    loopTimes = req.query.loopTimes;
    algorithm = req.query.algorithm;
   
    console.log(req.query.algorithm);
    console.log(req.query.size);
    console.log(req.query.probability);
    console.log(req.query.loopTimes);
    
    
    switch (size) {
	case "small": grammar = smallGrammar; break;
	case "medium": grammar = mediumGrammar; break;
	case "large": grammar = largeGrammar; break;
    }

	// generate JSON data randomly
	users[1] = Mock.mock(grammar);
	users[0] = JSON.parse(JSON.stringify(users[1]));
	fuzzer.seed(2);
    
    //set the probability to change the node
	fuzzer.changeChance(probability);

	// mutate JSON Object
	var generator = fuzzer.mutate.object(users[1]);
    
    for(var i=0; i<loopTimes; i++) {
        generator();
    }
	
	res.send(users);
}

exports.updateUser = function(req, res){
	console.log("----------------------------");
	
	var receiveTime = Date.now();
    
    var diffStartTime = req.body.diffStartTime;
    var diffEndTime = req.body.diffEndTime;
    var sendTime = req.body.sendTime;   
	var delta = req.body.delta;
  	var patchStartTime ;          
    var patchEndTime ;
 
    patchStartTime = Date.now();

    switch (algorithm) {
    	case "0":
    		break;
    	case "1":
	    	jsondiffpatch.patch(users[0], delta);
    		break;
    }

	patchEndTime = Date.now();
    


    var totalTime = (diffEndTime - diffStartTime) + (receiveTime - sendTime) + (patchEndTime - patchStartTime);

    var result = (diffEndTime - diffStartTime)+',' +(receiveTime - sendTime) +',' +(patchEndTime - patchStartTime)+ ','+totalTime+'\n';

    fs.writeFile('./result/'+size+'-P'+probability+'-L'+loopTimes+'-A'+algorithm+'.csv', result, {flag: 'a'}, function(err){
        if(err) throw err;
        console.log("success");
    });

    res.end();

}


