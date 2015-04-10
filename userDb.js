var jsondiffpatch = require('jsondiffpatch'),
	fuzzer = require('fuzzer'),
	Mock = require('mockjs'),
	fs = require('fs'),
	users = [];
var grammar;
var smallGrammar = {
    'father|10-10': [{
	 'id|+1': 1,
         "married|1" : true,
         "name" : "@FIRST @LAST",
	 "sons" : null,
	 "daughters|0-3" : [ 
	     { 
		  "age|0-31" : 0,
		  "name" : "@FIRST"
	     }
	 ]
    }],

    'string|1-10': '*'
};

var mediumGrammar = {
    'father|600-600': [{
	 'id|+1': 1,
         "married|1" : true,
         "name" : "@FIRST @LAST",
	 "sons" : null,
	 "daughters|0-3" : [ 
	     { 
		  "age|0-31" : 0,
		  "name" : "@FIRST"
	     }
	 ]
    }],

    'string|1-10': '*'
};

var largeGrammar = {
    'father|30000-30000': [{
	 'id|+1': 1,
         "married|1" : true,
         "name" : "@FIRST @LAST",
	 "sons" : null,
	 "daughters|0-3" : [ 
	     { 
		  "age|0-31" : 0,
		  "name" : "@FIRST"
	     }
	 ]
    }],

    'string|1-10': '*'
};

//get the parameters 
var size = process.argv.slice(2)[0];
var probability = process.argv.slice(3)[0];
var loopTimes = process.argv.slice(4)[0];

switch (size) {
	case "small": grammar = smallGrammar; break;
	case "medium": grammar = mediumGrammar; break;
	case "large": grammar = largeGrammar; break;
}


exports.findUser = function(req, res){
	// generate JSON data randomly
	users[1] = Mock.mock(grammar);
	users[0] = JSON.parse(JSON.stringify(users[1]));
    // console.log(users[1]);
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
	var receiveTime = Date.now();
    
    var diffStartTime = req.body.diffStartTime;
    var diffEndTime = req.body.diffEndTime;
    var sendTime = req.body.sendTime;   
	var delta = req.body.delta;
  
	var patchStartTime = Date.now();          
    jsondiffpatch.patch(users[0], delta);
    var patchEndTime = Date.now();

    console.log("Call to diff took " + (diffEndTime - diffStartTime) + " milliseconds.");
    console.log("Call to send took " + (receiveTime - sendTime) + " milliseconds.");
    console.log("Call to patch took " + (patchEndTime - patchStartTime) + " milliseconds.");

    var totalTime = (diffEndTime - diffStartTime) + (receiveTime - sendTime) + (patchEndTime - patchStartTime);

    var result = (diffEndTime - diffStartTime)+',' +(receiveTime - sendTime) +',' +(patchEndTime - patchStartTime)+ ','+totalTime+'\n';

    fs.writeFile(size+'-P'+probability+'-L'+loopTimes+'.csv', result, {flag: 'a'}, function(err){
        if(err) throw err;
        console.log("success");
    });

    res.end();

}


