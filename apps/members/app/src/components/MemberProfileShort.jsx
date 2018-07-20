import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, theme } from '@aragon/ui'
import Avatar from './Avatar'

const MemberProfileShort = ({ address, name }) => (
  <MemberProfileShortRoot>
    <Avatar seed={address} />
    <Text size="large" color={theme.textDimmed}>{name}</Text>
  </MemberProfileShortRoot>
)

MemberProfileShort.propTypes = {
  address: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

const MemberProfileShortRoot = styled.div`
  display: flex;
  align-items: center;
`

export default MemberProfileShort