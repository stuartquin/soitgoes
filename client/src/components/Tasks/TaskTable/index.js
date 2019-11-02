import React from "react";
import styled from "styled-components";

import { Grid, Cell } from "components/Grid";
import TaskRow from "./TaskRow";
import TaskTableHeader from "./TaskTableHeader";

const Styled = styled.div`
  border-radius: 6px;
  box-shadow: 0 4px 6px hsla(0, 0%, 40%, 0.74);
  max-width: 1200px;
  width: 100%;
  min-height: 400px;
`;

class TaskTable extends React.Component {
  render() {
    const { tasks, onTaskSelect } = this.props;

    return (
      <Styled>
        <TaskTableHeader />
        {tasks.map(task => (
          <TaskRow key={task.id} task={task} onClick={onTaskSelect} />
        ))}
      </Styled>
    );
  }
}

export default TaskTable;
