import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Text, Box, Flex } from 'rebass/styled-components';
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


const StatusCell = styled(Box)`
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
    const {task, onClick} = this.props;
    const {project} = task;
    const status = 'PAID';

    return (
      <Row onClick={() => onClick(task)} justifyContent="flexEnd">
        <Box flexGrow="1">
          <div>{task.name}</div>
          <ContactName>{project.name} - {project.contact.name}</ContactName>
        </Box>
        <Box display={['none', 'initial']} ml={4}>
          {task.hours_spent} / {task.hours_predicted}
        </Box>
        <Box display={['none', 'initial']} ml={4}>
          {task.due_date ?  moment(task.due_date).fromNow() : '-'}
        </Box>
        <StatusCell numeric xs="5" sm="2">
          <Text variant="amount" fontWeight={2} width="64px" ml={4}>
            {task.cost ? asCurrency(task.cost, project.currency || 'GBP', 0) : '-'}
          </Text>
        </StatusCell>
      </Row>
    );
  }
}

export default TaskRow;
