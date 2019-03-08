import React from 'react';

import UpcomingInvoice from './UpcomingInvoice';
import {Grid, Cell} from 'components/Grid';
import {groupByProject, getTotal} from 'services/timeslip';


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
    <Grid>
      {summary.map(item => (
        <UpcomingInvoice
          key={item.project.id}
          summary={item}
        />
      ))}
    </Grid>
  );
};

export default UpcomingSummary;
