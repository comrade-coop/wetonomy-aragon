import Aragon, { providers } from '@aragon/client'
import * as Member from '../models/Member'

let app = null

export const initializeApp = (window, subscription) => {
  app = new Aragon(new providers.WindowMessage(window))
  app.state()
    .map(state => ({ ...state }))
    .subscribe(subscription)
}

export const addMember = member => {
  if (Member.isValidMember(member)) {
    app.addMember(member.address, member.name, member.level.value)
  }
}

export const updateMember = (oldMember, newMember) => {
  if (!Member.isValidMember(newMember) || Member.areEqual(oldMember, newMember)) {
    return
  }
  
  const memberId = oldMember.id

  app.updateMember(
    memberId,
    newMember.address,
    newMember.name,
    newMember.level.value
  )  
}

export const removeMember = member => {
  if (Member.isValidMember(member)) {
    app.removeMember(member.id)      
  }   
}