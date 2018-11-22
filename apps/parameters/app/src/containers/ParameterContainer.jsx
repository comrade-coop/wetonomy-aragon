import React, { Component } from 'react'
import { connect } from 'react-redux'
import ContentUserProfile from '../components/Content/ContentUserProfile'
import ContentData from '../components/Content/ContentData'
import ContentParameters from '../components/Content/ContentParameters'
import { TokenType } from '../utils/appConstants'
import styled from 'styled-components'

import { togglePanelWithType } from '../actions/panel'
import { tokenChartChange } from '../actions/parameters'


class ParameterContainer extends Component {
  

  // handleClose = () => {
  //   const { dispatch } = this.props
  //   dispatch(closeAndReset())
  // }
  handleTokenChartChange = (type) => {
    const { dispatch } = this.props
    dispatch(tokenChartChange(type))
  }

  handlePanelToggle = (type) => {
    const { dispatch } = this.props
    dispatch(togglePanelWithType(type))
  } 
  render() {
    let userRewardTokens = 0
    let userDebtTokens = 0
    let labels = []
    let tokens = []
    
    if(this.props.rewardTokenHistory && this.props.rewardTokenHistory.length && this.props.rewardTokenHistory[this.props.rewardTokenHistory.length-1].tokens)
      userRewardTokens = this.props.userTokens.reward/this.props.rewardTokenHistory[this.props.rewardTokenHistory.length-1].tokens
    if(this.props.debtTokenHistory && this.props.debtTokenHistory.length && this.props.debtTokenHistory[this.props.debtTokenHistory.length-1].tokens) 
      userDebtTokens = this.props.userTokens.debt/this.props.debtTokenHistory[this.props.debtTokenHistory.length-1].tokens
    
    if(this.props.tokenChart === TokenType.REWARD ) {
      labels = this.props.rewardTokenHistory.map(data => data.block)
      tokens = this.props.rewardTokenHistory.map(data => data.tokens)
    } else {
      labels = this.props.debtTokenHistory.map(data => data.block)
      tokens = this.props.debtTokenHistory.map(data => data.tokens)
    }
    
    return (
      <Main>
        <ProfilData>
          <ContentUserProfile
            userRewardTokens = {userRewardTokens}
            userDebtTokens = {userDebtTokens}
          />
          <ContentData 
            rewardTokenHistory = {this.props.rewardTokenHistory}
            debtTokenHistory = {this.props.debtTokenHistory}
            userTokens = {this.props.userTokens}
            onTokenChartChange = {this.handleTokenChartChange}

            labels = {labels}
            tokens = {tokens}
            tokenChart = { this.props.tokenChart }
          />
        </ProfilData>
        <ContentParameters 
          initialReputation = {this.props.initialReputation}
          inflationMultiplier = {this.props.inflationMultiplier}
          rewardToDebtCourse = {this.props.rewardToDebtCourse}
          periodLength = {this.props.periodLength}
          maxHoursPerPeriod = {this.props.maxHoursPerPeriod}
          onPannelToggle = {this.handlePanelToggle}
        />
      </Main>
    )
  }
}



const Main = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
`
const ProfilData = styled.div`
  margin-bottom: 50px;
  display: flex;
`

const mapStateToProps = state => ({
  initialReputation: state.parameters.initialReputation,
  inflationMultiplier: state.parameters.inflationMultiplier,
  rewardToDebtCourse: state.parameters.rewardToDebtCourse,
  periodLength: state.parameters.periodLength,
  maxHoursPerPeriod: state.parameters.maxHoursPerPeriod,
  rewardTokenHistory: state.parameters.rewardTokenHistory,
  debtTokenHistory: state.parameters.debtTokenHistory,
  userTokens: state.parameters.userTokens,
  tokenChart: state.parameters.tokenChart
})


export default connect(mapStateToProps)(ParameterContainer)
