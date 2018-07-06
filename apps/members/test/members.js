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
    const newMemberAddress = '0x969f8a3667987823b84c4f22a4cdfea3ae724e86'
    const newMemberName = 'Pesho'
    const newMemberLevel = MemberLevels.INTERMEDIATE

    const tx = await instance.addMember(
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
    const shortMemberAddress = '0xf17f52151ebef6c7334fad080c5704d77216b732'
    const shortMemberName = 'Pe'
    const longMemberAddress = '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2'
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
    const shortMemberAddress = '0xf17f52151ebef6c7334fad080c5704d77216b732'
    const newMemberAddress = '0x5aeda56215b167893e80b4fe645ba6d5bab767de'
    const newMemberName = 'Pesho'
    const newMemberLevel = MemberLevels.JUNIOR

    const tx = await instance.addMember(newMemberAddress, newMemberName, newMemberLevel, {
      from: accounts[0]
    })
    await assertThrowsAsync(
      instance.addMember(newMemberAddress, newMemberName, newMemberLevel, { from: accounts[0] }),
      REVERT_MSG)
  })

  it('should remove a member correctly', async () => {
    const instance = await Members.deployed()
    const memberCount = (await instance.getMembersCount.call()).toNumber()

    const memberToRemoveId = memberCount - 1
    const tx = await instance.removeMember(memberToRemoveId)
    
    let newMemberCount = (await instance.getMembersCount.call()).toNumber()
    assert.equal(newMemberCount + 1, memberCount, 'Member wasn\'t removed correctly')

    await assertThrowsAsync(instance.getMember(memberToRemoveId), INVALID_OPCODE_MSG)

    const secondMemberToRemoveId = 0
    const txSecond = await instance.removeMember(secondMemberToRemoveId)

    newMemberCount = (await instance.getMembersCount.call()).toNumber()
    assert.equal(newMemberCount + 2, memberCount, 'Second member wasn\'t removed correctly')

    await assertThrowsAsync(instance.getMember(memberCount - 1), INVALID_OPCODE_MSG)
  })

})