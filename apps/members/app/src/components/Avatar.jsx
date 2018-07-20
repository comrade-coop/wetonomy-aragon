import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'
import {theme} from '@aragon/ui'

const AvatarRoot = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  margin-right: 18px;
  overflow: hidden;
`

const Avatar = (props) => (
  <AvatarRoot>
    <Blockies
      seed={props.seed}
      size={10}
      color={theme.gradientStart}
      bgColor={theme.text}
      spotColor={theme.gradientEnd} />
  </AvatarRoot>
)

Avatar.propTypes = {
  seed: PropTypes.string
}

export default Avatar
