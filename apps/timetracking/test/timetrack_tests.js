const TimeTracking = artifacts.require('TimeTracking')

contract('TimeTracking', async (accounts) => {

  it('should add first tracked hours', async () => {
    const instance = await TimeTracking.deployed()
    const owner = accounts[0];

    await instance.trackHours(3, {from:owner});
    var trackedHours = await instance.addressToTrackedHours.call(owner);

    assert.equal(3, trackedHours);
  })

  it('should sum up tracked hours', async () => {
    const instance = await TimeTracking.deployed()
    const owner = accounts[1];

    await instance.trackHours(3, {from:owner})
    await instance.trackHours(39, {from:owner});

    var trackedHours = await instance.addressToTrackedHours.call(owner);

    assert.equal(42, trackedHours.toNumber());
  })
})