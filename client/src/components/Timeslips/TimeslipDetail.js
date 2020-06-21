import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { selectBy } from 'services/selectors';
import { Select } from 'components/Form';

const Styled = styled.div`
  background: #d2ddec;
  position: absolute;
  border: solid 1px #d2ddec;
  border-top: 0;
  padding: 8px 12px;
  margin-top: -1px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 0.85em;
  box-shadow: 0 6px 4px hsla(0, 0%, 40%, 0.2);
`;

const TimeslipDetail = ({ tasks }) => {
  console.log(tasks);
  return (
    <Styled>
      <strong>Task:</strong>
      <Select>
        {tasks.map((t) => (
          <option value={t.id}>{t.name}</option>
        ))}
      </Select>
    </Styled>
  );
};

const mapStateToProps = (state, { project }) => {
  return {
    tasks: selectBy(state.task.items, project.id, 'project'),
  };
};

export default connect(mapStateToProps, {})(TimeslipDetail);
