import React from 'react'
import styled from 'styled-components'
import { Text, CircleGraph, theme } from '@aragon/ui'
import { TokenType } from '../../utils/appConstants'
import { Line } from 'react-chartjs-2'

const chart = (props) => {
  console.log(props)
  return (
    <Div>
      <Line
        data={{ 
          labels: props.labels,
          datasets: [
            {
              label: `Wetonomy ${props.tokenChart} Tokens`,
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(33, 193, 231,0.4)',
              borderColor: 'rgb(33, 193, 231,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgb(33, 193, 231,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgb(33, 193, 231,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: props.tokens
            }
          ]
        }} />
    </Div>
  )
}
const ContentData = (props) => (
  <Data>
    {/* {props.rewardTokenHistory.length === 0? '':()} */}
    {chart(props)}
    <FlexCircle>
      <TokenBox>
        <Tokens onClick={() => props.onTokenChartChange(TokenType.DAO)}>
          <Text size="xlarge" color={theme.textSecondary}>Dao Tokens: </Text>
          <Text size="xlarge" weight="bold" color={theme.accent}> 
            {props.daoTokenHistory.length === 0? '0':(
              props.daoTokenHistory[props.daoTokenHistory.length-1].tokens
            )}
          </Text>
        </Tokens>
        <Tokens onClick={() => props.onTokenChartChange(TokenType.REWARD)}>
          <Text size="xlarge" color={theme.textSecondary}>Reward Tokens: </Text>
          <Text size="xlarge" weight="bold" color={theme.accent}> 
            {props.rewardTokenHistory.length === 0? '0':(
              props.rewardTokenHistory[props.rewardTokenHistory.length-1].tokens
            )}
          </Text>
        </Tokens>
      </TokenBox>
      <CircleGraphBox>
        <CircleGraph value={1/3} />
        <br/>
        <Text>Wetonomy</Text>
        <MarginedButton mode="strong"><Text weight="bold">Chart</Text></MarginedButton>
      </CircleGraphBox>
      <CircleGraphBox>
        <CircleGraph value={2/3} />
        <br/>
        <Text>ScyNet</Text>
        <MarginedButton mode="strong"><Text weight="bold">Chart</Text></MarginedButton>
      </CircleGraphBox>
    </FlexCircle>
  </Data>
)
const TokenBox = styled.div`
  width: 250px;
  height: 380px;
  margin-top: 50px;
  text-align: center;
`
const Tokens = styled.div`
  margin-top: 40px;
  padding: 8px;
  border-radius: 15px;
  cursor: pointer;
  border: 1px solid #fff;
  :hover {
    background: #f7fbfd;
  }
  
`
const Data = styled.div`
  width: 80%;
  height: 380px;
  background: white;
  margin-left: 30px;
  border-radius: 15px;
  margin-top: 10px;
  padding: 20px;
  display: flex;
  box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
`
const FlexCircle = styled.div`
  width: 800px;
  margin-left: auto;
  display: flex;
  justify-content: space-around;
`
const Div= styled.div`
  width: 700px;
  margin-top: 10px;
`
const MarginedButton = styled.div`
  background-image: linear-gradient( 130deg,#00B4E6,#00F0E0 );
  padding: 5px;
  color: white;
  width: 100px;
  border-radius: 7px;
  height: 30px;
  cursor: pointer;
  margin-top: 90px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  :hover {
    opacity: 0.8;
    box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
	}
`
const CircleGraphBox = styled.div`
  width: 200px;
  height: 300px;
  background: white;
  text-align: center;
  padding-top: 40px;
  margin-top: 20px;
  border-radius: 15px;
  box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
	:hover {
			box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
	}
`
export default ContentData