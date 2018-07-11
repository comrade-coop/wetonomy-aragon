import styled from 'styled-components'
import PropTypes from 'prop-types'
import logo from '../assets/logo.svg'

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: papayawhip;
  margin-right: 18px;
`

Avatar.propTypes = {
  src: PropTypes.string
}

Avatar.defaultProps = {
  src: logo
}

export default Avatar
