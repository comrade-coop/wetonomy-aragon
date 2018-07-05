const { assertThrowsAsync } = require("./helpers/util")
const Members = artifacts.require('Members')

const MEMBER_INDEX_ADDRESS = 0
const MEMBER_INDEX_NAME = 1
const MEMBER_MIN_NAME_LENGTH = 3
const MEMBER_MAX_NAME_LENGTH = 30
const REVERT_MSG = /VM Exception while processing transaction: revert/

contract('Members', async (accounts) => {

  it('should add a new member correctly', async () => {
    const instance = await Members.deployed()
    const memberCount = await instance.getMemberCount.call()
    const newMemberAddress = '0x969f8a3667987823b84c4f22a4cdfea3ae724e86'
    const newMemberName = 'Pesho'

    const tx = await instance.addMember(newMemberAddress, newMemberName, { from: accounts[0] })

    const member = await instance.members.call(memberCount)
    assert.equal(newMemberAddress, member[MEMBER_INDEX_ADDRESS],
      'Member wasn\'t added with the correct address')
    assert.equal(newMemberName, member[MEMBER_INDEX_NAME],
      'Member wasn\'t added with the correct name')

    const newCount = await instance.getMemberCount.call()
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
      instance.addMember(shortMemberAddress, shortMemberName, { from: accounts[0] }),
      REVERT_MSG)
    await assertThrowsAsync(
      instance.addMember(longMemberAddress, longMemberName, { from: accounts[0] }),
      REVERT_MSG)
  })

  it('should not add a member with the same address twice', async () => {
    const instance = await Members.deployed()
    const shortMemberAddress = '0xf17f52151ebef6c7334fad080c5704d77216b732'
    const newMemberAddress = '0x5aeda56215b167893e80b4fe645ba6d5bab767de'
    const newMemberName = 'Pesho'

    const tx = await instance.addMember(newMemberAddress, newMemberName, {
      from: accounts[0]
    })
    await assertThrowsAsync(
      instance.addMember(newMemberAddress, newMemberName, { from: accounts[0] }),
      REVERT_MSG)
  })

  it('should remove a member correctly', async () => {
    const instance = await Members.deployed()
    const memberCount = (await instance.getMemberCount.call()).toNumber()

    const tx = await instance.removeMember(memberCount - 1)
    
    const newMemberCount = (await instance.getMemberCount.call()).toNumber()
    assert.equal(newMemberCount + 1, memberCount, 'Member wasn\'t removed correctly')
  })
})