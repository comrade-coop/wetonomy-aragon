const TimeTracking = artifacts.require('TimeTracking')
const Members = artifacts.require('Members.sol')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')
const timeTravel = require('@aragon/test-helpers/timeTravel')(web3)
const Kernel = artifacts.require('Kernel')
const ACL = artifacts.require('ACL')
const DAOFactory = artifacts.require('DAOFactory')


const PERIOD_LENGTH_SECONDS = 5
const MAX_HOURS = 10
const MEMBERS_INITIAL_REPUTATION = 1

const MEMBERS_ID = '0x01'
const TIME_TRACKING_ID = '0x02'

contract('TimeTracking', async (accounts) => {
  let app
  let membersApp
  const root = accounts[0]
  const NULL_ADDRESS = '0x00'

  before(async () => {
    const kernelBase = await Kernel.new(true) // petrify immediately
    const aclBase = await ACL.new()
    daoFactory = await DAOFactory.new(
      kernelBase.address,
      aclBase.address,
      NULL_ADDRESS
    )

    // Setup constants
    APP_MANAGER_ROLE = await kernelBase.APP_MANAGER_ROLE()
  })

  beforeEach(async () => {
    const daoTx = await daoFactory.newDAO(root)
    const dao = Kernel.at(
      daoTx.logs.filter(log => log.event == 'DeployDAO')[0].args.dao
    )
    const acl = ACL.at(await dao.acl())

    await acl.createPermission(root, dao.address, APP_MANAGER_ROLE, root, {
      from: root
    })

    membersApp = await installApp(
      dao,
      Members,
      MEMBERS_ID,
      root,
      MEMBERS_INITIAL_REPUTATION
    )
    app = await installApp(
      dao,
      TimeTracking,
      TIME_TRACKING_ID,
      root,
      membersApp.address,
      PERIOD_LENGTH_SECONDS,
      MAX_HOURS
    )
    
    await configurePermissions(
      acl,
      membersApp,
      app
    )

    membersApp.addMember(root, 'John', 1)

    

    const periodLengthContract = await app.periodLength.call()
    const maxHoursContract = await app.maxHoursPerPeriod.call()

    assert.equal(PERIOD_LENGTH_SECONDS, periodLengthContract)
    assert.equal(MAX_HOURS, maxHoursContract)
  })

  it('should add first tracked hours', async () => {
    await app.trackWork(3, { from: root })
    const trackedHours = await app.addressToTrackedHours.call(root)

    assert.equal(3, trackedHours)
  })

  it('should sum up tracked hours', async () => {
    await app.trackWork(1, { from: root })
    await app.trackWork(3, { from: root })

    const trackedHours = await app.addressToTrackedHours.call(root)

    assert.equal(4, trackedHours.toNumber())
  })

  it('shouldn\'t track hours exceeding limit', async () => {
    assertRevert(() => app.trackWork(1342432, { from: root }))
  })

  it('should create a new period after the last one has passed', async () => {
    await app.trackWork(3, { from: root })
    timeTravel(PERIOD_LENGTH_SECONDS + 1)
    await app.trackWork(3, { from: root })
    const periodCount = await app.getPeriodsCountForAddress(root)
    assert.equal(periodCount.toNumber(), 2)
  })

  it('shouldn\'t allow a non-member to track', async () => {
    const nonMember = accounts[1]
    assertRevert(() => app.trackWork(1, { from: nonMember }))
  })

  const installApp = async (dao, contractClass, appId, root, ...initArgs) => {
    const baseContract = await contractClass.new()

    const receipt = await dao.newAppInstance(
      appId,
      baseContract.address,
      '0x',
      false,
      {
        from: root
      }
    )
    const proxyAddress = receipt.logs.filter(log => log.event == 'NewAppProxy')[0]
      .args.proxy

    const appInstance = contractClass.at(proxyAddress)
    appInstance.initialize(...initArgs, { from: root })

    return appInstance
  }
  const configurePermissions = async (
    acl,
    membersApp,
    timeTracking
  ) => {
    const MANAGE_MEMBERS_ROLE = await membersApp.MANAGE_MEMBERS_ROLE()
    const MANAGE_TRACKING_ROLE = await timeTracking.MANAGE_TRACKING_ROLE()
    await acl.createPermission(root, timeTracking.address,  MANAGE_TRACKING_ROLE, root, { from: root })
    await acl.createPermission(root,      membersApp.address,   MANAGE_MEMBERS_ROLE, root, { from: root })
    
  }
})