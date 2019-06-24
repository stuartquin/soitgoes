import React, {useState} from 'react';
import styled from 'styled-components';

import PopOver from 'components/PopOver';
import {Checkbox, Label, Input, Select} from 'components/Form';
import {Button} from 'components/GUI';

const Row = styled.div`
  margin-bottom: 16px;
  min-width: 250px;
`;

const DisplaySettings = ({ displaySettings, onChange, onCancel }) => {
  const handleChange = ({target}) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    onChange({
      ...displaySettings,
      [target.name]: value
    });
  };

  return (
    <PopOver
      title="Display Settings"
      onClose={onCancel}
    >
      <Row>
        <Label>Group By</Label>
        <Select
          name="groupBy"
          value={displaySettings.groupBy || ''}
          onChange={handleChange}
        >
          <option value="time">Time</option>
          <option value="task">Task</option>
        </Select>
      </Row>

      <Row>
        <Label>Show Hours</Label>
        <Checkbox
          name="showHours"
          type="checkbox"
          checked={displaySettings.showHours}
          onChange={handleChange}
        />
      </Row>
    </PopOver>
  );
};

export default DisplaySettings;
