import React from 'react'
import { NavLink } from 'react-router-dom'
import { theme } from '@aragon/ui'
import styled from 'styled-components'

const NavMenu = () => (
  <NavMenuRoot>
    <StyledNavLink exact to="/timeline">Timeline</StyledNavLink>
    <StyledNavLink exact to="/dashboard">Dashboard</StyledNavLink>
    <StyledNavLink exact to="/my-tasks">My Tasks</StyledNavLink>
  </NavMenuRoot>
)

const NavMenuRoot = styled.nav`
  display: flex;
`

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  margin-right: 7px;
  color: ${theme.textSecondary};
  font-size: 20px;  
  line-height: 2;
  padding: 0px 20px;
  border-radius: 5px;
  transition: background-color 0.25s, color 0.25s, box-shadow 0.25s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &.active {
    color: ${theme.gradientStart};
    background-color: white;
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.16);    
  }
`

export default NavMenu