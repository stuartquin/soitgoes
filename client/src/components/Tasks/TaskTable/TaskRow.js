import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Link } from 'react-router-dom'

import {BREAKPOINTS, Grid, Cell, CellMd} from 'components/Grid';
import {asCurrency} from 'services/currency';
import {Row} from 'components/DataTable';

const STATUS_MAP = {
  DRAFT: 'draft',
  PENDING: 'warning',
  OVERDUE: 'danger',
  PAID: 'success',
};

const ContactName = styled.div`
  color: #828282;
  font-size: 0.9em;
  margin-top: 4px;
`;

const Total = styled.div`
  margin-left: 4px;
`;

const StatusCell = styled(Cell)`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media(max-width: ${BREAKPOINTS.sm}) {
    min-width: auto;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

class TaskRow extends React.Component {
  render() {
    const {task} = this.props;
    const {project} = task;
    const status = 'PAID';

    return (
      <Row>
        <Cell xs="7" sm="6">
          <div>{task.name}</div>
          <ContactName>{project.name} - {project.contact.name}</ContactName>
        </Cell>
        <CellMd sm="2" numeric>
          {task.hours_spent} / {task.hours_predicted}
        </CellMd>
        <CellMd sm="2" numeric>
          {moment(task.due_date).fromNow()}
        </CellMd>
        <StatusCell numeric xs="5" sm="2">
          <Total>
            {asCurrency(task.cost, project.currency || 'GBP')}
          </Total>
        </StatusCell>
      </Row>
    );
  }
}

export default TaskRow;
