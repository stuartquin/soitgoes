import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import {Header} from 'components/DataTable';
import {Cell, CellMd} from 'components/Grid';
import InvoiceItem from './InvoiceItem';

const timeslipInvoiceItem = (timeslip, project) => {
  const subTotal = project.hourly_rate * timeslip.hours;
  return {
    id: timeslip.id,
    details: `${timeslip.hours} hours on ${timeslip.date}`,
    unitPrice: project.hourly_rate,
    subTotal: subTotal
  }
};

const taskInvoiceItem = (task) => {
  return {
    id: task.id,
    details: task.name,
    unitPrice: task.cost,
    subTotal: task.cost,
  }
};

const Styled = styled.div`
  min-height: 600px;
  flex-grow: 1;
`;

class Generator extends React.Component {
  render() {
    const {timeslips, project} = this.props;
    const isEditable = this.props.isEditable;
    const timeslipItems = Object.values(timeslips).sort((a, b) => {
      return a.date > b.date ? 1 : -1;
    }).filter(t =>
      t.hours > 0
    );

    return (
      <Styled>
        <Header>
          <Cell xs="7" sm="5">Time</Cell>
          <CellMd sm="2">Unit</CellMd>
          <Cell sm="2">Total</Cell>
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
      </Styled>
    );
  }
}

export {Generator}
