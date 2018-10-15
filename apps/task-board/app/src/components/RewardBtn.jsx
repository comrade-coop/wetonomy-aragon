import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const RewardBtn = ({ onRewardClick, onMouseLeave, task, points }) => {
  return (
    <RewardBtnContainer>
      <NotPriority className="star" id={'star' + task.id}>
        {points === 0 ? (
          <i className="material-icons">star_border</i>
        ) : (
          points
        )}
      </NotPriority>
      <Absolute className="parent">
        <Div>
          <TopContainer onMouseLeave={onMouseLeave}>
            <Priority onClick={() => onRewardClick(10)}>
              10
            </Priority>
            <Priority onClick={() => onRewardClick(20)}>
              20
            </Priority>
            <Priority onClick={() => onRewardClick(30)}>
              30
            </Priority>
            <Priority onClick={() => onRewardClick(40)}>
              40
            </Priority>
            <Priority onClick={() => onRewardClick(50)}>
              50
            </Priority>
          </TopContainer>
        </Div>
      </Absolute>
    </RewardBtnContainer>
  )
}

RewardBtn.propTypes = {
  onRewardClick: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  points: PropTypes.number.isRequired
}

RewardBtn.defaultProps = {
  onRewardClick: () => {},
  onMouseLeave: () => {},
  task: { id: 0 },
  points: 0
}

const RewardBtnContainer = styled.div`
  position: relative;
  max-height: 40px;
`

const Div = styled.div`
  z-index: 1;
  position: relative;
  background: white;
  height: 40px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);
  border-radius: 50px;
  display: inline-block;
`

const Absolute = styled.div`
  position: absolute;
  top: -0;
`

const TopContainer = styled.div`
  display: flex;
  padding-left: 32px;
`

const NotPriority = styled.div`
  height: 40px;
  width: 40px;
  color: #00b4e6;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);
  :hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.26), 0 0 5px rgba(0, 0, 0, 0.33);
  }
`
const Priority = styled.div`
  height: 40px;
  width: 40px;
  color: #fff;
  text-align: center;
  padding-top: 2px;
  cursor: pointer;
  border-radius: 35px;  
  margin-left: 8px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  background-image: linear-gradient(130deg, #00b4e6, #00f0e0);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);

  &:first-child {
    margin-left: 15px;
  }

  :hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.26), 0 0 5px rgba(0, 0, 0, 0.33);
    -webkit-transition: all 1s ease-in-out;
  }
`

export default RewardBtn