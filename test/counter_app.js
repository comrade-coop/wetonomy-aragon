const CounterApp = artifacts.require('./CounterApp.sol')

contract('CounterApp', function(accounts) {
  it("should assert true", function(done) {
    var counter_app = CounterApp.deployed();
    assert.isTrue(true);
    done();
  });
});
