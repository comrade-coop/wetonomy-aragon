import React from 'react'
import styled from 'styled-components'
import { Card, Text, theme, Button, Badge } from '@aragon/ui'
import PropTypes from 'prop-types'

import RewardBtn from './RewardBtn'

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

const ActivityCard = ({ task, onAcceptClick }) => (
  <StyledCard>
    <Category color={theme.textSecondary} size="normal">
      {task.workField}
    </Category>

    <Title size="xlarge">{task.heading}</Title>
    {task.tags && renderTags(task.tags)}

    <Description color={theme.textSecondary} size="normal">
      {task.description}
    </Description>

    {task.difficulty && (
      <Difficulty color={theme.textSecondary}>
        Difficulty: <Text weight="bold">{task.difficulty}</Text>
      </Difficulty>
    )}

    <ActivityBottomContainer>
      <RewardBtn />
      <Rewards>
        Rewards so far:
        <Text color={theme.gradientStart} weight="bold">
          {task.rewards} DAO Tokens
        </Text>
      </Rewards>
      <Button mode="strong" onClick={() => onAcceptClick(task)}>
        Accept Task
      </Button>
    </ActivityBottomContainer>
  </StyledCard>
)

ActivityCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    workField: PropTypes.string,
    heading: PropTypes.string.isRequired,
    description: PropTypes.string,
    project: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.string.isRequired,
    tokens: PropTypes.number.isRequired,
    issuer: PropTypes.string.isRequired,
    type: PropTypes.string,
    date: PropTypes.string
  }),
  onAcceptClick: PropTypes.func.isRequired
}

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

export default ActivityCard
