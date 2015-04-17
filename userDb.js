var jsondiffpatch = require('jsondiffpatch'),
	fuzzer = require('fuzzer'),
	Mock = require('mockjs'),
	fs = require('fs'),
	users = [];
var test = require('unit.js');
var assert = test.assert;
var grammar, size, probability, algorithm;

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

exports.findUser = function(req, res){
	console.log("==========================");
	console.log(req.query);

    size = req.query.size;
    probability = req.query.probability;
    algorithm = req.query.algorithm;
   
    console.log(req.query.algorithm);
    console.log(req.query.size);
    console.log(req.query.probability);
    
    
    switch (size) {
	case "small": grammar = smallGrammar; break;
	case "medium": grammar = mediumGrammar; break;
	case "large": grammar = largeGrammar; break;
    }

	// generate JSON data randomly
	users[1] = Mock.mock(grammar);
	users[0] = JSON.parse(JSON.stringify(users[1]));

    // var num = Math.floor((Math.random() * 100) + 1);

	fuzzer.seed(41);
    
    //set the probability to change the node
	fuzzer.changeChance(probability);

	// mutate JSON Object
	var generator = fuzzer.mutate.object(users[1]);
    
    // tranverse it 
    generator();

    // users[0] = {
    //     "father": [
    //     {
    //         "id": 1,
    //         "married": true,
    //         "name": "George Williams",
    //         "sons": null,
    //         "daughters": [
    //         {
    //             "age": 3,
    //             "name": "Richard"
    //         },
    //         {
    //             "age": 28,
    //             "name": "Steven"
    //         },
    //         {
    //             "age": 8,
    //             "name": "Susan"
    //         }
    //         ]
    //     }
    //     ],
    //     "string": "*"
    // };

    // users[1] = {
    //     "father": [
    //     {
    //         "id": 2,
    //         "married": true,
    //         "name": "George Williams",
    //         "sons": null,
    //         "daughters": [
    //         {
    //             "age": 3,
    //             "name": "Richard"
    //         },
    //         {
    //             "age": 28,
    //             "name": "Steven"
    //         },
    //         {
    //             "age": 8,
    //             "name": "Susan"
    //         }
    //         ]
    //     }
    //     ],
    //     "string": "*"
    // };
	
	res.send(users);
}

exports.updateUser = function(req, res){
	console.log("----------------------------");
	
	var receiveTime = Date.now();
    
    var diffStartTime = req.body.diffStartTime;
    var diffEndTime = req.body.diffEndTime;
    var sendTime = req.body.sendTime;   
    var delta = req.body.delta;
	var rate = req.body.rate;
    console.log(rate);
  	var patchStartTime ;          
    var patchEndTime ;
 
    patchStartTime = Date.now();

    switch (algorithm) {
    	case "0":
    	    users[0] = delta;
    		break;
    	case "1":
	    	jsondiffpatch.patch(users[0], delta);
    		break;
    }

	patchEndTime = Date.now();
    
    //assert the data is the same
    var flag = false;
    console.log(JSON.stringify(users[0]).length);
    console.log(JSON.stringify(users[1]).length);
    var err = test.error(function() {
        //assert the data
   	    assert.equal(JSON.stringify(users[0]), JSON.stringify(users[1]));
   	    //set the flag
        flag = true;
   	    throw new Error('OK!');
    });
    // if (JSON.stringify(users[0]) === JSON.stringify(users[1])){
    //     flag = true;
    // }
    if(flag) {
    	//the two data is the same
        writeCSV();
        res.send("ok");
    } else {
    	//the two data is not the same
        res.send("ko");
    }

    function writeCSV () {

        var totalTime = (diffEndTime - diffStartTime) + (receiveTime - sendTime) + (patchEndTime - patchStartTime);

        var result = (diffEndTime - diffStartTime)+',' +(receiveTime - sendTime) +',' +(patchEndTime - patchStartTime)+ ','+totalTime+','+rate+ '\n';

        fs.writeFile('./result/'+size+'-P'+probability+'-A'+algorithm+'.csv', result, {flag: 'a'}, function(err){
            if(err) throw err;
            console.log("success");
        });

    }

}


