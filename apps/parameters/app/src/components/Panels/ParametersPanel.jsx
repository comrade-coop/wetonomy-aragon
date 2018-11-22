import React from 'react'
import { SidePanel } from '@aragon/ui'
import PropTypes from 'prop-types'
import BaseForm from '../Forms/BaseForm'
import { PanelMode } from '../../utils/appConstants'

// TODO Clear function
const _getPanelContent = (mode, onParameterChange, onClose) => {
  switch (mode) {
    case PanelMode.MEMBERS_REPUTATUIN: {
      return (
        <BaseForm
          onClose = {onClose} 
          value = {40}
          mode = { mode }
          onParameterChange = { onParameterChange }
          parameter="Initial Member Reputation:"
        />
      )
    }
    case PanelMode.TIMETRACKING_PERIOD: {
      return (
        <BaseForm
          onClose = {onClose} 
          value = {40}
          mode = { mode }
          onParameterChange = { onParameterChange }
          parameter="Period Lenght:"
          sideInfo=" Days" />
      )
    }
    case PanelMode.TIMETRACKING_MAX_HOURS: {
      return (
        <BaseForm
          onClose = {onClose} 
          value = {40}
          mode = { mode }
          onParameterChange = { onParameterChange }
          parameter="Max Hours per Month:"
          sideInfo=" Hours" />
      )
    }
    case PanelMode.TOKEN_MULTIPLAYER: {
      return (
        <BaseForm
          onClose = {onClose} 
          value = {40}
          mode = { mode }
          onParameterChange = { onParameterChange }
          parameter="Default Inflation Multiplayer:"  />
      )
    }
    case PanelMode.REWARD_TO_DEBT_COURSE: {
      return (
        <BaseForm
          onClose = {onClose} 
          value = {40}
          mode = { mode }
          onParameterChange = { onParameterChange }
          parameter="Reward To Debt Course:"  />
      )
    }
    default: {
      return (
        <div></div>
      )
    }
  }
}

const ParametersPanel = ({ mode, opened, onParameterChange, onClose, selectedTask }) => (
  <SidePanel
    title={mode}
    opened={opened}
    onClose={onClose}>
    {_getPanelContent(mode, onParameterChange, onClose, selectedTask)}
  </SidePanel>
)

ParametersPanel.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onParameterChange: PropTypes.func.isRequired
}

export default ParametersPanel