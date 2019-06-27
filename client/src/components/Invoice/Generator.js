import React, {useState} from 'react';
import styled from 'styled-components';
import moment from 'moment'; import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCog} from '@fortawesome/free-solid-svg-icons'

import {Header} from 'components/DataTable';
import {Cell, CellMd} from 'components/Grid';
import {ActionLink} from 'components/GUI';
import InvoiceItem from './InvoiceItem';
import DisplaySettings from './DisplaySettings';
import {groupByTimeslip, groupByTask} from 'services/invoice';

const Styled = styled.div`
  min-height: 600px;
  flex-grow: 1;
  border-top-right-radius: 6px;
`;

const DisplaySettingsCell = styled(Cell)`
  position: relative;
`;

const Generator = ({
  invoice, timeslips, tasks, onRemoveTask, onRemoveTimeslip
}) => {
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [displaySettings, setDisplaySettings] = useState({
    groupBy: 'time',
    showHours: true,
  });
  const handleRemoveItem = ({ itemType, id }) => (
    itemType === 'task' ? onRemoveTask(id) : onRemoveTimeslip(id)
  );

  const {project} = invoice;
  const {showHours} = displaySettings;
  const isEditable = !Boolean(invoice.issued_at);
  const items = displaySettings.groupBy === 'time' ?
    groupByTimeslip(timeslips, project.hourly_rate) :
    groupByTask(tasks, timeslips, project.hourly_rate, showHours);

  return (
    <Styled>
      <Header>
        <Cell xs="11" sm="7">Item</Cell>
        <CellMd numeric sm={isEditable ? '2' : '3'}>Unit</CellMd>
        <CellMd numeric sm="2">Total</CellMd>
        <DisplaySettingsCell numeric xs="1">
          <ActionLink
            title="Display Settings"
            onClick={() => setShowDisplaySettings(true)}
          >
            <FontAwesomeIcon icon={faCog} />
          </ActionLink>
          {showDisplaySettings && (
            <DisplaySettings
              displaySettings={displaySettings}
              onChange={setDisplaySettings}
              onCancel={() => setShowDisplaySettings(false)}
            />
          )}
        </DisplaySettingsCell>
      </Header>
      {items.map(item => (
        <InvoiceItem
          key={item.id}
          item={item}
          project={project}
          onAction={handleRemoveItem}
          isEditable={isEditable}
        />
      ))}

    </Styled>
  );
};

export default Generator;
