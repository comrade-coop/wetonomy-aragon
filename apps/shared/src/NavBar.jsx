import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import logo from '../assets/logo.svg'

const Navigation = (AppBar) => {
  return (
    <NavBar>
      <WetonomyIcon><Icon src={logo} width="57" height="57"/></WetonomyIcon>
      {AppBar}
    </NavBar>
  )
}
  
Navigation.propTypes = {
  AppBar: PropTypes.object
}
const Icon = styled.img`
  margin: 0px 8px;
  cursor: pointer;
`

const NavBar = styled.div`
  display: flex;
  background: #FFFFFF;
`
const WetonomyIcon = styled.div`
  border-bottom: 1px solid #E6E6E6;
  padding-left: 30px;
`