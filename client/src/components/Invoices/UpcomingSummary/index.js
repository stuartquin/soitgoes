import React from 'react';
import styled from 'styled-components';

import UpcomingInvoice from './UpcomingInvoice';
import {Grid, Cell} from 'components/Grid';
import {groupByProject, getTotal} from 'services/timeslip';


const StyledUpcomingSummary = styled(Grid)`
  min-height: 150px;
`;


const UpcomingSummary = ({timeslips}) => {
  const grouped = Object.values(groupByProject(timeslips));
  const summary = grouped.map(items => ({
    project: items[0].project,
    date: items[0].date,
    total: getTotal(items)
  })).filter(({total}) => total > 0).sort((a, b) => (
    a.total < b.total
  )).slice(0, 4);

  return (
    <StyledUpcomingSummary>
      {summary.map(item => (
        <UpcomingInvoice
          key={item.project.id}
          summary={item}
        />
      ))}
    </StyledUpcomingSummary>
  );
};

export default UpcomingSummary;
