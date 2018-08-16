const TimeTracking = artifacts.require('TimeTracking')
const Members = artifacts.require('./mocks/MembersMock.sol')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')
const timeTravel = require('@aragon/test-helpers/timeTravel')(web3)

const PERIOD_LENGTH_SECONDS = 5
const MAX_HOURS = 10

contract('TimeTracking', async (accounts) => {

  let app
  const member = accounts[0]

  beforeEach(async () => {
    membersApp = await Members.new()
    app = await TimeTracking.new()
    
    membersApp.addMember(member, 'John', 1)

    await app.initialize(
      membersApp.address,
      PERIOD_LENGTH_SECONDS, 
      MAX_HOURS)

    const periodLengthContract = await app.periodLength.call()
    const maxHoursContract = await app.maxHoursPerPeriod.call()

    assert.equal(PERIOD_LENGTH_SECONDS, periodLengthContract)
    assert.equal(MAX_HOURS, maxHoursContract)
  })

  it('should add first tracked hours', async () => {
    await app.trackWork(3, { from: member })
    const trackedHours = await app.addressToTrackedHours.call(member)

    assert.equal(3, trackedHours)
  })

  it('should sum up tracked hours', async () => {
    await app.trackWork(1, { from: member })
    await app.trackWork(3, { from: member })

    const trackedHours = await app.addressToTrackedHours.call(member)

    assert.equal(4, trackedHours.toNumber())
  })

  it('shouldn\'t track hours exceeding limit', async () => {
    assertRevert(() => app.trackWork(1342432, { from: member }))
  })

  it('should create a new period after the last one has passed', async () => {
    await app.trackWork(3, { from: member })
    timeTravel(PERIOD_LENGTH_SECONDS + 1)
    await app.trackWork(3, { from: member })
    const periodCount = await app.getPeriodsCountForAddress(member)
    assert.equal(periodCount.toNumber(), 2)
  })

  it('shouldn\'t allow a non-member to track', async () => {
    const nonMember = accounts[1]
    assertRevert(() => app.trackWork(1, { from: nonMember }))
  })
})