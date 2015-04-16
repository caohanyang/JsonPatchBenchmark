describe('Protractor Demo App', function() {
  var size = element(by.model('size'));
  var probability = element(by.model('probability'));
  var loopTimes = element(by.model('loopTimes'));
  var algorithm = element(by.model('algorithm'));
  var goButton = element(by.id('gobutton'));
  var latestResult = element(by.binding('mark'));

  beforeEach(function() {
    browser.get('http://localhost:8080');
    
  });
  
  var algorithmArr = [0];
  var sizeArr = ["small", "medium", "large"];
  var probabilityArr = [0.01, 0.05, 0.1];
  //var loopTimesArr = [1, 2];

it("do the test", function() {
   for(var a=0; a<algorithmArr.length; a++) {
     for(var s=0; s<sizeArr.length; s++) {
         for(var p=0; p<probabilityArr.length; p++) {
               add(algorithmArr[a], sizeArr[s], probabilityArr[p]);
        }
     }
  }         

});

function add(a, s, p) {
    algorithm.sendKeys(a);
    size.sendKeys(s);
    probability.sendKeys(p);
    goButton.click();
    expect(latestResult.getText()).toEqual('ok');
}

});