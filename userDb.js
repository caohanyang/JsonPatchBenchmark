var jsondiffpatch = require('jsondiffpatch'),
	fuzzer = require('fuzzer'),
	Mock = require('mockjs'),
	users = [];

exports.findUser = function(req, res){
	// generate JSON data randomly
	users[1] = Mock.mock({
		'father|1000-1000': [{
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
	});
	users[0] = JSON.parse(JSON.stringify(users[1]));

	fuzzer.seed(2);

	// mutate JSON Object
	var generator = fuzzer.mutate.object(users[1]);
    
	generator();
	
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

    res.end();

}


