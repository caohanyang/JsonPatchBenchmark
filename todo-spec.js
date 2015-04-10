describe('Protractor Demo App', function() {
  it('should add one and two', function() {
    browser.get('http://localhost:8080');
    expect(element(by.binding('mark')).getText()).
        toEqual('ok'); // This is wrong!
  });
});
