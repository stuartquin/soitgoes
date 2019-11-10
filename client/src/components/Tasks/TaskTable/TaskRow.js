import React from "react";
import moment from "moment";
import styled from "styled-components";
import { Text, Box, Flex } from "rebass/styled-components";
import { Link } from "react-router-dom";

import { BREAKPOINTS, Grid, Cell, CellMd } from "components/Grid";
import { asCurrency } from "services/currency";
import { Row } from "components/DataTable";
import StatusPill from "components/StatusPill";

const ContactName = styled.div`
  color: #828282;
  font-size: 0.9em;
  margin-top: 4px;
`;

const StatusCell = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: ${BREAKPOINTS.sm}) {
    min-width: auto;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const formatDate = date => {
  return date ? moment(date).format("YYYY-MM-DD") : "-";
};

const getStatus = task => {
  if (task.completed_at) {
    return "success";
  }

  return "draft";
};

const getCost = task => {
  return asCurrency(task.cost, task.project.currency);
};

class TaskRow extends React.Component {
  render() {
    const { task, onClick } = this.props;
    const { project } = task;
    const status = "PAID";

    return (
      <Row onClick={() => onClick(task)} justifyContent="flexEnd">
        <Box flexGrow="1">
          <div>{task.name}</div>
          <ContactName>
            {project.name} - {project.contact.name}
          </ContactName>
        </Box>
        <Box width="64px">
          <Text variant="amount" fontWeight={2}>
            {getCost(task)}
          </Text>
        </Box>
        <Flex alignItems="center" justifyContent="flex-end">
          <Box display={["none", "initial"]} ml={4}>
            {formatDate(task.created_at)}
          </Box>
          <StatusPill
            minWidth="87px"
            status={getStatus(task)}
            fontSize={[12, 14]}
            display="inline"
            ml={4}
          >
            {task.completed_at
              ? formatDate(task.completed_at)
              : formatDate(task.due_date)}
          </StatusPill>
        </Flex>
      </Row>
    );
  }
}

export default TaskRow;
