import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Text, theme } from '@aragon/ui'
import ExplorePost from '../components/ExplorePost'
import { NO_ACTIVITY_LABEL, EXPLORE_LABEL } from '../utils/appConstants'

class ExploreScreen extends Component {
  renderPosts() {
    return this.props.tasks.map(task => (
      <ExplorePost
        task={task}
        onAcceptClick={this.handleAcceptClick}
        key={task.id}
      />
    ))
  }

  handleAcceptClick(taskId) {
    console.log(taskId)
  }

  renderPostsSection() {
    return (
      <React.Fragment>
        <WideText color={theme.textSecondary} size="xlarge">
          {EXPLORE_LABEL}
        </WideText>
        {this.renderPosts()}
      </React.Fragment>
    )
  }

  renderEmptySection() {
    return (
      <WideCenterText color={theme.textSecondary} size="xxlarge">
        {NO_ACTIVITY_LABEL}
      </WideCenterText>
    )
  }

  render() {
    return (
      <ExploreScreenContainer>
        {this.props.tasks.length > 0
          ? this.renderPostsSection()
          : this.renderEmptySection()}
      </ExploreScreenContainer>
    )
  }
}

const WideText = styled(Text)`
  width: 780px;
  margin-bottom: 20px;
`

const WideCenterText = styled(WideText)`
  text-align: center;
  margin-top: 50px;
`

const ExploreScreenContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
`

const mapStateToProps = state => ({
  tasks: state.tasks.tasks,
  realTasks: state.tasks.realTasks
})

export default connect(mapStateToProps)(ExploreScreen)
