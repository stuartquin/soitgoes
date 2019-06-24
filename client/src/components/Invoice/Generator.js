import React, {useState} from 'react';
import styled from 'styled-components';
import moment from 'moment'; import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCog} from '@fortawesome/free-solid-svg-icons'

import {Header} from 'components/DataTable';
import {Cell, CellMd} from 'components/Grid';
import {ActionLink} from 'components/GUI';
import InvoiceItem from './InvoiceItem';
import DisplaySettings from './DisplaySettings';

const Styled = styled.div`
  min-height: 600px;
  flex-grow: 1;
  border-top-right-radius: 6px;
`;

const Generator = ({
  invoice, timeslips, tasks, onRemoveTask, onRemoveTimeslip
}) => {
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const {project} = invoice;
  const timeslipItems = Object.values(timeslips).sort((a, b) => {
    return a.date > b.date ? 1 : -1;
  }).filter(t => t.hours > 0);
  const taskItems = Object.values(tasks).sort((a, b) => {
    return a.completed_at > b.completed_at ? 1 : -1;
  });
  const isEditable = !Boolean(invoice.issued_at);

  return (
    <Styled>
      <Header>
        <Cell xs="11" sm="7">Item</Cell>
        <CellMd numeric sm={isEditable ? '2' : '3'}>Unit</CellMd>
        <CellMd numeric sm="2">Total</CellMd>
        <Cell numeric xs="1">
          <ActionLink
            title="Display Settings"
            onClick={() => setShowDisplaySettings(true)}
          >
            <FontAwesomeIcon icon={faCog} />
          </ActionLink>
        </Cell>
      </Header>
      {timeslipItems.map((timeslip) => (
        <InvoiceItem
          key={timeslip.id}
          project={project}
          title={`${timeslip.hours} hours`}
          subTitle={moment(timeslip.date).format('MMM. DD, YYYY')}
          unitPrice={project.hourly_rate}
          subTotal={timeslip.hours * project.hourly_rate}
          isEditable={isEditable}
          onRemove={() => onRemoveTimeslip(timeslip.id)}
        />
      ))}

      {taskItems.map((task) => (
        <InvoiceItem
          key={task.id}
          project={project}
          title={task.name}
          subTitle={moment(task.due_date).format('MMM. DD, YYYY')}
          unitPrice={task.cost}
          subTotal={task.cost}
          isEditable={isEditable}
          onRemove={() => onRemoveTask(task.id)}
        />
      ))}

      {showDisplaySettings && (
        <DisplaySettings
          onCancel={() => setShowDisplaySettings(false)}
        />
      )}
    </Styled>
  );
};

export default Generator;
