import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Text, Flex } from "rebass/styled-components";

import Task from "components/Task";
import Heading from "components/Heading";
import Filter from "components/Filter";
import { BREAKPOINTS, Container, Grid, Cell } from "components/Grid";
import { Button } from "components/GUI";
import { selectWithProject, selectJoined } from "services/selectors";
import { fetchTasks } from "services/task";

import TaskTable from "./TaskTable";

const Styled = styled.div`
  background: #f5f3f5;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0, 0%, 40%, 0.2);
  height: 100%;
  max-width: 1200px;
  width: 100%;

  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column-reverse;
  }
`;

const Tasks = ({ projects }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const projectOptions = [
    {
      value: null,
      label: "All Projects"
    }
  ].concat(
    Object.values(projects).map(p => ({
      value: p.id,
      label: p.name
    }))
  );
  const loadTasks = async (projectId = null) => {
    const response = await fetchTasks({ project: projectId });
    setTasks(selectWithProject(response.results, projects));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <React.Fragment>
      <Container>
        <Flex alignItems="center" justifyContent="space-between" mb={12}>
          <Filter
            label="Project"
            options={projectOptions}
            onChange={({ value }) => loadTasks(value)}
          />
          <Button onClick={() => setSelectedTask({})}>New</Button>
        </Flex>

        <Styled>
          <TaskTable tasks={tasks} onTaskSelect={setSelectedTask} />
        </Styled>
      </Container>

      {selectedTask && (
        <Task
          task={selectedTask}
          projects={projects}
          onCancel={() => setSelectedTask(null)}
        />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state, { match }) => {
  return {
    projects: selectJoined(state.project.items, state)
  };
};

export default connect(
  mapStateToProps,
  {}
)(Tasks);
