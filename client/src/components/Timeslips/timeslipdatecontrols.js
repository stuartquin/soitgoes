import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { Button } from 'components/GUI';

// How many days to jump
const DAY_OFFSET = 7;

const Styled = styled.div``;

const SmallButton = styled(Button)`
  margin-left: 4px;
`;

const getPreviousWeek = (date) => {
  return date.clone().subtract(DAY_OFFSET, 'days');
};

const getNextWeek = (date) => {
  return date.clone().add(DAY_OFFSET, 'days');
};

const TimeslipDateControls = ({ weekStart, onSetActiveDate }) => {
  return (
    <Styled>
      <SmallButton onClick={() => onSetActiveDate(getPreviousWeek(weekStart))}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </SmallButton>

      <SmallButton onClick={() => onSetActiveDate(getNextWeek(weekStart))}>
        <FontAwesomeIcon icon={faCaretRight} />
      </SmallButton>
    </Styled>
  );
};

export default TimeslipDateControls;
