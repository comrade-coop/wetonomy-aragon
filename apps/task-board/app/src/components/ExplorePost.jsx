import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, theme, Badge, Card, Button } from '@aragon/ui'
import { DIFFICULTIES, WORK_FIELD } from '../utils/appConstants'
import Avatar from '../components/Top/Avatar'
import RewardBtn from './RewardBtn'

const _assignee = (user, task) => {
  if (task.column === 3 && user === task.issuer) {
    return (
      <Finish  style={{ background: '#9c55ebe3' }}>
        Reward
      </Finish>
    )
  }
  if (user === task.assignee && task.column < 3) {
    return <Finish >Finish</Finish>
  }
  if(task.assignee !== null) {
    return (
      <UserAvatar>
        <Avatar seed={task.assignee} />
      </UserAvatar>
    )
  }
  else return ''
}

const ExplorePost = ({ task, user, onAcceptClick }) => (
  <PostRoot>
    <PostHeaderRoot>
      <Avatar seed={task.issuer} />
      <PostText color={theme.textSecondary} size="large">
        {task.issuer} Proposed a new Task
      </PostText>
      <Text color={theme.textSecondary}>{task.date}</Text>
    </PostHeaderRoot>

    <StyledCard>
      <Category color={theme.textSecondary} size="normal">
        {WORK_FIELD[task.workField]}
      </Category>

      <Title size="xlarge">{task.heading}</Title>
      {task.tags && renderTags(task.tags)}

      <Description color={theme.textSecondary} size="normal">
        {task.description}
      </Description>

      {task.difficulty && (
        <Difficulty color={theme.textSecondary}>
          Difficulty: <Text weight="bold">{DIFFICULTIES[task.difficulty]}</Text>
        </Difficulty>
      )}

      <ActivityBottomContainer>
        <RewardBtn />
        <Rewards>
          Rewards so far:
          <Text color={theme.gradientStart} weight="bold">
            {task.tokens} DAO Tokens
          </Text>
        </Rewards>
        {task.assignee === null && task.issuer !== user ? (
          <Button mode="strong" onClick={() => onAcceptClick(task)}>
            Accept Task
          </Button>
        ) : (
          _assignee(user, task)
        )}
        
      </ActivityBottomContainer>
    </StyledCard>
  </PostRoot>
)

ExplorePost.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    workField: PropTypes.number,
    heading: PropTypes.string.isRequired,
    description: PropTypes.string,
    project: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.number.isRequired,
    tokens: PropTypes.string.isRequired,
    issuer: PropTypes.string.isRequired,
    type: PropTypes.string,
    // date: PropTypes.string
  }),
  onAcceptClick: PropTypes.func.isRequired
}

const renderTags = tags => (
  <BadgesContainer>
    {tags.map(tag => (
      <CategoryBadge
        background="paleturquoise"
        foreground="#33333377"
        key={tag}>
        {tag}
      </CategoryBadge>
    ))}
  </BadgesContainer>
)

const PostText = styled(Text)`
  margin-left: 10px;
`

const PostHeaderRoot = styled.div`
  display: flex;
  margin: 0px 10px 10px 10px;
  align-items: center;

  & > span:last-child {
    margin-left: auto;
  }
`

const PostRoot = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const BadgesContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`

const CategoryBadge = styled(Badge)`
  margin-right: 8px;
`

const BottomMarginedText = styled(Text)`
  margin-bottom: 15px;
`

const Category = styled(Text)`
  margin-bottom: 10px;
`

const Title = styled(Text)`
  margin-bottom: 5px;
`

const Description = styled(BottomMarginedText)``

const Difficulty = styled(BottomMarginedText)``

const Rewards = styled(Text)`
  margin: 0px 15px;
`
const Finish = styled.div`
  height: 26px;
  color: white;
  text-align: center;
  width: 60px;
  padding: 3px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  display: inline-block;
  float: right;
  margin-top: 4px;
  background: #5ae39d;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);
  :hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.26), 0 0 5px rgba(0, 0, 0, 0.33);
  }
`
const UserAvatar = styled.div`
  position: absolute;
  right: 5px;
  bottom: 0px;
`
const ActivityBottomContainer = styled.div`
  display: flex;
  align-items: center;

  & > button:last-child {
    margin-left: auto;
  }
`

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  min-width: 400px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 50px;
  padding: 15px;
  height: auto;
`

export default ExplorePost
