import React, {useState} from 'react';
import styled from 'styled-components';

import Dialog from 'components/Dialog';
import {Checkbox, Label, Input, Select} from 'components/Form';
import {Button} from 'components/GUI';

const Row = styled.div`
  margin-bottom: 16px;
`;

const DisplaySettings = ({ onApply, onCancel }) => {
  const [form, setForm] = useState({
    groupBy: 'time',
    showHours: true,
  });

  const handleChange = ({target}) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setForm({
      ...form,
      [target.name]: value
    });
  };

  return (
    <Dialog
      title="Display Settings"
      onClose={onCancel}
      actions={[
        <Button
          key={1}
          type="submit"
          onClick={() => onApply(form)}
        >
          Apply
        </Button>,
      ]}
    >
      <Row>
        <Label>Group By</Label>
        <Select
          name="groupBy"
          value={form.groupBy || ''}
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
          checked={form.showHours}
          onChange={handleChange}
        />
      </Row>
    </Dialog>
  );
};

export default DisplaySettings;
