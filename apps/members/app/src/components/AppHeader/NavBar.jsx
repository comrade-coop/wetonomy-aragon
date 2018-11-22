import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import wetonomy from '../../assets/wetonomy.png'

const Navigation = ({AppBar}) => {
  return (
    <NavBar>
      <WetonomyIcon><img src={wetonomy} alt='Wetonomy' width="60" height="50"/></WetonomyIcon>
      {AppBar}
    </NavBar>
  )
}
  
Navigation.propTypes = {
  AppBar: PropTypes.object
}

const NavBar = styled.div`
  display: flex;
  background: #FFFFFF;
`
const WetonomyIcon = styled.div`
  border-bottom: 1px solid #E6E6E6;
  padding-left: 30px;
  padding-top: 7px;
  z-index: 3;
`
export default Navigation