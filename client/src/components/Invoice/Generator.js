import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import {Header} from 'components/DataTable';
import {Cell, CellMd} from 'components/Grid';
import InvoiceItem from './InvoiceItem';

const Styled = styled.div`
  min-height: 600px;
  flex-grow: 1;
  border-top-right-radius: 6px;
`;

class Generator extends React.Component {
  render() {
    const {invoice} = this.props;
    const {project, timeslips, tasks} = invoice;
    const isEditable = this.props.isEditable;
    const timeslipItems = Object.values(timeslips).sort((a, b) => {
      return a.date > b.date ? 1 : -1;
    }).filter(t => t.hours > 0);
    const taskItems = Object.values(tasks).sort((a, b) => {
      return a.completed_at > b.completed_at ? 1 : -1;
    });

    return (
      <Styled>
        <Header>
          <Cell xs="8" sm="6">Item</Cell>
          <CellMd sm="2">Unit</CellMd>
          <CellMd sm="2">Total</CellMd>
        </Header>
        {timeslipItems.map((timeslip) => (
          <InvoiceItem
            key={timeslip.id}
            project={project}
            title={`${timeslip.hours} hours`}
            subTitle={moment(timeslip.date).format('MMM. DD, YYYY')}
            unitPrice={project.hourly_rate}
            subTotal={timeslip.hours * project.hourly_rate}
          />
        ))}

        {taskItems.map((task) => (
          <InvoiceItem
            key={task.id}
            project={project}
            title={task.name}
            subTitle={moment(task.due_date).format('MMM. DD, YYYY')}
            unitPrice={task.cost}
            subTotal={task.cost}
          />
        ))}
      </Styled>
    );
  }
}

export default Generator;
