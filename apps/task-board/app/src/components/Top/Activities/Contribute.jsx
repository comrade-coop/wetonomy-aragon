import React from 'react'
import styled from 'styled-components'
// import PropTypes from 'prop-types'
import { Text, theme } from '@aragon/ui'
import { DIFFICULTIES, DELETE_TYPE } from '../../../utils/appConstants'
import Icon from '../Icon'
import removeLogo from '../../../assets/delete.svg'

const Contribute = (props) => {
  return (
    <Reward className="star">
      <Left>
        <i style={{ fontSize: '30px' }} className="material-icons">star_border</i>
      </Left>
      <Content>
        <div>
          <Text color={theme.textSecondary}>
            {props.task.heading.length > 35 ? props.task.heading.substring(0, 25) + ' ...' : props.task.heading}
          </Text>
          <Difficulty>
            <Context>
              <Text color={theme.textTertiary} >Difficulty: </Text>
              <Text color={theme.textTertiary} weight="bold">{DIFFICULTIES[props.task.difficulty]}</Text>
            </Context>
            <Context>
              <Text color={theme.accent} >Reward:</Text>
              <Text color={theme.accent} weight="bold"> {props.task.tokens}  </Text>
            </Context>
          </Difficulty>
        </div>
        <DeleteIcon className="parent" src={removeLogo} alt="Remove Member"
          onClick={() => props.onDelete(props.task, DELETE_TYPE.REMOVE_CONTRIBUTION)} />
      </Content>
    </Reward>
  )
}
export const Context = styled.div`
    padding-top:2px;
`

export const DeleteIcon = styled(Icon)`
	position: absolute;
	right: -5px;
	bottom: 12px;
	display: none;
`

export const Difficulty = styled.div`
	font-size: 13px;
	display: flex;
	font-weight: 400;
	justify-content: space-between
`

export const Left = styled.div`
	height: 40px;
	width: 40px;
	display:inline-block;
	color: white;
	background: #00b4e6cc;
	border-radius: 25px;
	text-align: center;
	padding-top: 5px;
`
export const Content = styled.div`
	height: 100%;
	display: inline-block;
	width: 80%;
	color: #00B4E6;
	font-size: 12px;
	padding: 0px 10px 10px 10px;
	font-size: 13px;
	font-weight: 600;
`
export const Reward = styled.div`
	padding: 5px;
	margin-top: 15px;
	position:relative;
	border-radius: 25px 15px 15px 25px;
	height 50px;
	display: flex;
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
	:hover {
			box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
			DeleteIcon {
				display: block;
			}
	}
	:first-child {
		margin-top: 3px;
	}
`
export default Contribute