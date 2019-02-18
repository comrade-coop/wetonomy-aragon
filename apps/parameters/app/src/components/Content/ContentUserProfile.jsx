import React from 'react'
import styled from 'styled-components'
import { Text, theme, CircleGraph } from '@aragon/ui'
import { MemberAvatar } from '../Top/MemberProfile'

const ContentUserProfile = (props) => (
  <UserBox>
    <MemberContainer>
      <MemberAvatar seed={'0xb4124ceb3451635dacedd11767f004d8a28c6ee7'} radius={'50%'} width={'70px'} />
    </MemberContainer>
    <Content>
      <Flex>
        <First><Text size="large" color={theme.textSecondary}>User: </Text></First>
        <Second><Text size="large" weight="bold"  color={theme.textSecondary}>Ioan Stoianov</Text></Second>
      </Flex>
      <Flex>
        <First><Text size="large" color={theme.textSecondary}>Level: </Text></First>
        <Second><Text size="large" weight="bold" color={theme.textSecondary}>Intermediate</Text></Second>
      </Flex>
      <Flex>
        <First><Text size="large" color={theme.textSecondary}>Role: </Text></First>
        <Second><Text size="large" weight="bold" color={theme.textSecondary}>Developer</Text></Second>
      </Flex>
    </Content>
    <Flex>
      <div>
        <Text>Reward</Text><br/>
        <CircleGraph value={props.userRewardTokens} />
      </div>
      <div>
        <Text>Debt</Text><br/>
        <CircleGraph value={props.userDebtTokens} />
      </div>
    </Flex>
  </UserBox>
)
const UserBox = styled.div`
  width: 300px;
  height: 400px;
  background: white;
  text-align: center;
  padding: 30px 20px 20px 20px;
  border-radius: 15px;
  box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  :hover {
    box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
	}
`
const MemberContainer = styled.div`
  z-index: 1;
  border: 2px solid #21c1e7;
  padding: 5px;
  border-radius: 50px;
  width: 84px;
  margin-left: auto;
  margin-right: auto;
`
const Content = styled.div`
  font-size: 20px;
  width: 100%;
  height: 140px;
  margin-bottom: 15px;
`
const First = styled.div`
  margin-top: 15px;
  font-size: 18px;
  width: 30px;
`
const Second = styled.div`
  margin-top: 15px;
  font-size: 18px;
  width: 140px;
`
const Flex = styled.div`
  display: flex;
  justify-content: space-around;
`
export default ContentUserProfile