const { assertThrowsAsync } = require("./helpers/util")
const Members = artifacts.require('Members')

const MEMBER_INDEX_ADDRESS = 0
const MEMBER_INDEX_NAME = 1
const MEMBER_INDEX_LEVEL = 2
const MEMBER_MIN_NAME_LENGTH = 3
const MEMBER_MAX_NAME_LENGTH = 30
const REVERT_MSG = /revert/
const INVALID_OPCODE_MSG = /invalid opcode/
const MemberLevels = {
  JUNIOR: 0,
  INTERMEDIATE: 0,
  SENIOR: 0,
  EXPERT: 0,
}

contract('Members', async (accounts) => {
  it('should add a new member correctly', async () => {    
    const instance = await Members.deployed()
    const memberCount = await instance.getMembersCount.call()
    const newMemberAddress = accounts[0]
    const newMemberName = 'Pesho'
    const newMemberLevel = MemberLevels.INTERMEDIATE

    await instance.addMember(
      newMemberAddress,
      newMemberName,
      newMemberLevel,
      { from: accounts[0] }
    )

    const member = await instance.getMember.call(memberCount)
    assert.equal(newMemberAddress, member[MEMBER_INDEX_ADDRESS],
      'Member wasn\'t added with the correct address')
    assert.equal(newMemberName, member[MEMBER_INDEX_NAME],
      'Member wasn\'t added with the correct name')
    assert.equal(newMemberLevel, member[MEMBER_INDEX_LEVEL],
      'Member wasn\'t added with the correct level')

    const newCount = await instance.getMembersCount.call()
    assert.equal(memberCount + 1, newCount.toNumber(),
      'Member count didn\'t increase')
  })

  it('should not add a member with an invalid name', async () => {    
    const instance = await Members.deployed()
    const shortMemberAddress = accounts[1]
    const shortMemberName = 'Pe'
    const longMemberAddress = accounts[2]
    const longMemberName = 'Peuhwefheufheifhwiuefhweuisdsda'

    await assertThrowsAsync(
      instance.addMember(shortMemberAddress, shortMemberName, MemberLevels.JUNIOR, { from: accounts[0] }),
      REVERT_MSG)
    await assertThrowsAsync(
      instance.addMember(longMemberAddress, longMemberName, MemberLevels.JUNIOR, { from: accounts[0] }),
      REVERT_MSG)
  })

  it('should not add a member with the same address twice', async () => {    
    const instance = await Members.deployed()
    const newMemberAddress = accounts[3]
    const newMemberName = 'Pesho'
    const newMemberLevel = MemberLevels.JUNIOR

    await instance.addMember(newMemberAddress, newMemberName, newMemberLevel, {
      from: accounts[0]
    })
    await assertThrowsAsync(
      instance.addMember(newMemberAddress, newMemberName, newMemberLevel, { from: accounts[0] }),
      REVERT_MSG)
  })

  it('shouldn\'t update a member\'s name if it\'s invalid', async () => {
    const instance = await Members.deployed()

    const newAddress = accounts[4]
    const newName = 'Pesho'
    const newLevel = MemberLevels.INTERMEDIATE

    const updatedNameShort = 'Go'
    const updatedNameLong = 'Gooidjiodfjeiwojoiejfoejwfoiejfiojweoijfoefejf'
    
    await instance.addMember(
      newAddress,
      newName,
      newLevel,
      { from: accounts[0] }
    )
    
    const updatedMemberIndex = await instance.getMembersCount.call() - 1

    assertThrowsAsync(
      instance.setMemberName(updatedMemberIndex, updatedNameShort, { from: accounts[0] }),
      REVERT_MSG
    )
    assertThrowsAsync(
      instance.setMemberName(updatedMemberIndex, updatedNameLong, { from: accounts[0] }),
      REVERT_MSG
    )    
  })

  it('shouldn\'t update a member\'s address if it\'s invalid', async() => {
    const instance = await Members.deployed()

    const newAddress = accounts[5]
    const newName = 'Pesho'
    const newLevel = MemberLevels.INTERMEDIATE

    await instance.addMember(
      newAddress,
      newName,
      newLevel,
      { from: accounts[0] }
    )
    
    const updatedMemberIndex = await instance.getMembersCount.call() - 1

    const updatedAddress = '0x0000000000000000000000000000000000000000'

    assertThrowsAsync(
      instance.setMemberAddress(updatedMemberIndex, updatedAddress, { from: accounts[0] }),
      REVERT_MSG
    )
  })

  it('shouldn\'t update a member\'s level if it\'s invalid', async() => {
    const instance = await Members.deployed()

    const newAddress = accounts[6]
    const newName = 'Pesho'
    const newLevel = MemberLevels.INTERMEDIATE

    await instance.addMember(
      newAddress,
      newName,
      newLevel,
      { from: accounts[0] }
    )

    const updatedMemberIndex = await instance.getMembersCount.call() - 1

    const updatedLevel = 34

    assertThrowsAsync(
      instance.setMemberLevel(updatedMemberIndex, updatedLevel, { from: accounts[0] }),
      INVALID_OPCODE_MSG
    )
  })

  it('should update a member correctly', async () => {
    const instance = await Members.deployed()

    const newMemberAddress = accounts[7]
    const newMemberName = 'Pesho'
    const newMemberLevel = MemberLevels.INTERMEDIATE

    const updatedMemberName = 'Gosho'
    const updatedMemberAddress = accounts[6]
    const updatedMemberLevel = MemberLevels.SENIOR

    await instance.addMember(
      newMemberAddress,
      newMemberName,
      newMemberLevel,
      { from: accounts[0] }
    )
    
    const updatedMemberIndex = await instance.getMembersCount.call() - 1

    await instance.updateMember(
      updatedMemberIndex, 
      updatedMemberAddress,
      updatedMemberName,
      updatedMemberLevel)

    const member = await instance.getMember.call(updatedMemberIndex)
    assert.equal(updatedMemberAddress, member[MEMBER_INDEX_ADDRESS],
      'Member wasn\'t updated with the correct address')
    assert.equal(updatedMemberName, member[MEMBER_INDEX_NAME],
      'Member wasn\'t updated with the correct name')
    assert.equal(updatedMemberLevel, member[MEMBER_INDEX_LEVEL],
      'Member wasn\'t updated with the correct level')
  })

  it('should remove a member correctly', async () => {
    const instance = await Members.deployed()
    const memberCount = (await instance.getMembersCount.call()).toNumber()

    const memberToRemoveId = memberCount - 1
    await instance.removeMember(memberToRemoveId)
    
    let newMemberCount = (await instance.getMembersCount.call()).toNumber()
    assert.equal(newMemberCount + 1, memberCount, 'Member wasn\'t removed correctly')

    await assertThrowsAsync(instance.getMember(memberToRemoveId), INVALID_OPCODE_MSG)

    const secondMemberToRemoveId = 0
    await instance.removeMember(secondMemberToRemoveId)

    newMemberCount = (await instance.getMembersCount.call()).toNumber()
    assert.equal(newMemberCount + 2, memberCount, 'Second member wasn\'t removed correctly')

    await assertThrowsAsync(instance.getMember(memberCount - 1), INVALID_OPCODE_MSG)
  })
})