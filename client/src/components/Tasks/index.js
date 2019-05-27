import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';

import Task from 'components/Task';
import NavMenu from 'components/nav/navmenu';
import Heading from 'components/Heading';
import {BREAKPOINTS, Container, Grid, Cell} from 'components/Grid';
import {Button} from 'components/GUI';
import {selectJoinedResults, selectJoined} from 'services/selectors';
import {fetchTasks} from 'modules/task';

import TaskTable from './TaskTable';

const Styled = styled.div`
  background: #f5f3f5;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);
  height: 100%;
  max-width: 1200px;
  width: 100%;

  display: flex;
  flex-wrap: wrap;

  @media(max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column-reverse;
  }
`;

const Tasks = ({ tasks, fetchTasks }) => {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const NewButton = (
    <Button type="success" onClick={setShowNewDialog}>New Task</Button>
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <React.Fragment>
      <NavMenu />
      <Container>
        <Heading size="h2" action={NewButton}>Tasks</Heading>
        <Styled>
          <TaskTable
            tasks={tasks}
          />
        </Styled>
      </Container>

      {showNewDialog && (
        <Task
          task={tasks.length ? tasks[0] : null}
          onCancel={() => setShowNewDialog(false)}
        />
      )}
    </React.Fragment>
  );
}

const mapStateToProps = (state, { match }) => {
  const project = selectJoined(state.project.items, state);

  return {
    tasks: selectJoinedResults(state.task.items, {project}, state.task.results)
  };
};

export default connect(mapStateToProps, {
  fetchTasks,
})(Tasks);
