import React from 'react';
import styled from 'styled-components';

import {Grid, Cell, CellMd} from 'components/Grid';
import {Header} from 'components/DataTable';


const TaskTableHeader = () => (
  <Header>
    <Cell xs="7" sm="6">
      Task
    </Cell>
    <CellMd numeric sm="2">
      Hours/Est.
    </CellMd>
    <CellMd numeric sm="2">
      Due Date
    </CellMd>
    <Cell numeric xs="5" sm="2">
      Amount
    </Cell>
  </Header>
);

export default TaskTableHeader;
