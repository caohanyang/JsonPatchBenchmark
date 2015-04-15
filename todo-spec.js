describe('Protractor Demo App', function() {
  var size = element(by.model('size'));
  var probability = element(by.model('probability'));
  var loopTimes = element(by.model('loopTimes'));
  var algorithm = element(by.model('algorithm'));
  var goButton = element(by.id('gobutton'));
  var latestResult = element(by.binding('mark'));

  beforeEach(function() {
    //browser.get('http://jsonbenchmark-218523.euw1-2.nitrousbox.com:8080');
    browser.get('http://ghostblog-213388.euw1-2.nitrousbox.com:8080');
    
  });
  
  var algorithmArr = [1, 0];
  var sizeArr = ["small", "medium", "large"];
  var probabilityArr = [0.01, 0.05, 0.1];
  var loopTimesArr = [1, 2];

it("do the test", function() {
   for(var a=0; a<algorithmArr.length; a++) {
     for(var s=0; s<sizeArr.length; s++) {
         for(var p=0; p<probabilityArr.length; p++) {
             for(var l=0; l<loopTimesArr.length; l++) {
             	
			         add(algorithmArr[a], sizeArr[s], probabilityArr[p], loopTimesArr[l]);
			         
             }
        }
     }
  }         

});

function add(a, s, p ,l) {
    algorithm.sendKeys(a);
    size.sendKeys(s);
    probability.sendKeys(p);
    loopTimes.sendKeys(l);
    goButton.click();
    expect(latestResult.getText()).toEqual('ok');
}

});