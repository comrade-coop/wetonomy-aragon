import React from 'react'
import PropTypes from 'prop-types'
import MemberFormBase from './MemberFormBase'

import { ADD_MEMBER_FORM_BTN_LABEL } from '../../utils/appConstants'

const AddMemberForm = ({ onAddMember, onCancel }) => (
  <MemberFormBase
    onSubmitMember={onAddMember}
    onCancel={onCancel}
    submitBtnText={ADD_MEMBER_FORM_BTN_LABEL} />
)

AddMemberForm.propTypes = {
  onAddMember: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default AddMemberForm