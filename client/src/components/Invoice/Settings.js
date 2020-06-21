import React from 'react';
import styled from 'styled-components';
import { Flex } from 'rebass/styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import Summary from 'components/Invoice/Summary';
import { Divider, SettingsCard } from 'components/GUI';
import { Input } from 'components/Form';
import { BREAKPOINTS } from 'components/Grid';

const Settings = (props) => {
  const {
    invoice,
    project,
    modifiers,
    reference,
    dueDate,
    tasks,
    onChange,
    onRemoveModifier,
  } = props;
  const isIssued = Boolean(invoice.issued_at);

  return (
    <SettingsCard>
      <Flex
        justifyContent="space-between"
        flexDirection="column"
        py={[3, 4]}
        px={2}
      >
        <div>Due Date</div>
        <Input
          type="date"
          name="due_date"
          value={dueDate || ''}
          onChange={onChange}
          disabled={isIssued}
        />
      </Flex>

      <Flex
        justifyContent="space-between"
        flexDirection="column"
        py={[3, 4]}
        px={2}
      >
        <div>Reference</div>
        <Input
          type="text"
          name="reference"
          value={reference || ''}
          onChange={onChange}
          disabled={isIssued}
        />
      </Flex>

      <Divider />

      <Summary
        modifiers={modifiers}
        invoice={invoice}
        project={project}
        tasks={tasks}
        onRemoveModifier={onRemoveModifier}
      />
    </SettingsCard>
  );
};

export default Settings;
