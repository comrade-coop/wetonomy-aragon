const TimeTracking = artifacts.require('TimeTracking')
const { sleep } = require('../../shared/test-utils/util')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')

const MEMBERS_ADDRESS_DEFAULT = '0x0000000000000000000000000000000000000000'
const PERIOD_LENGTH_SECONDS = 5
const MAX_HOURS = 10

contract('TimeTracking', async (accounts) => {

  it('should initialize the app with the right period length, and limit', async () => {
    const instance = await TimeTracking.deployed()
    const owner = accounts[0]

    await instance.initialize(
      MEMBERS_ADDRESS_DEFAULT,
      PERIOD_LENGTH_SECONDS, 
      MAX_HOURS, 
      { from: owner })

    const periodLengthContract = await instance.periodLength.call()
    const maxHoursContract = await instance.maxHoursPerPeriod.call()

    assert.equal(PERIOD_LENGTH_SECONDS, periodLengthContract)
    assert.equal(MAX_HOURS, maxHoursContract)
  })

  it('should add first tracked hours', async () => {
    const instance = await TimeTracking.deployed()
    const owner = accounts[0]

    await instance.trackWork(3, { from:owner })
    const trackedHours = await instance.addressToTrackedHours.call(owner)

    assert.equal(3, trackedHours)
  })

  it('should sum up tracked hours', async () => {
    const instance = await TimeTracking.deployed()
    const owner = accounts[1]

    await instance.trackWork(1, { from:owner })
    await instance.trackWork(3, { from:owner })

    const trackedHours = await instance.addressToTrackedHours.call(owner)

    assert.equal(4, trackedHours.toNumber())
  })

  it('shouldn\'t track hours exceeding limit', async () => {
    const instance = await TimeTracking.deployed()
    const owner = accounts[1]

    assertRevert(() => instance.trackWork(134, { from:owner }))
  })

  it('should create a new period after the last one has passed', async () => {
    const instance = await TimeTracking.deployed()
    const owner = accounts[1]

    // Multiplying with 1.5 since blocktime doesn't equal real time
    await sleep(PERIOD_LENGTH_SECONDS * 1000 * 1.5)
    await instance.trackWork(3, { from:owner })

    const periodCount = await instance.getPeriodsCountForAddress(owner)
    assert.equal(periodCount.toNumber(), 2)
  })
})