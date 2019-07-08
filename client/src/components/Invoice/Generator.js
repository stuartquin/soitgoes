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

const DisplaySettingsCell = styled(Cell)`
  position: relative;
`;

const Generator = ({
  invoice, items, onRemove, onSetDisplaySettings
}) => {
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const {project} = invoice;
  const isEditable = !Boolean(invoice.issued_at);

  return (
    <Styled>
      <Header>
        <Cell xs="11" sm="7">Item</Cell>
        <CellMd numeric sm={isEditable ? '2' : '3'}>Unit</CellMd>
        <CellMd numeric sm="2">Total</CellMd>
        {isEditable && (
          <DisplaySettingsCell numeric xs="1">
            <ActionLink
              title="Display Settings"
              onClick={() => setShowDisplaySettings(true)}
            >
              <FontAwesomeIcon icon={faCog} />
            </ActionLink>
            {showDisplaySettings && (
              <DisplaySettings
                displaySettings={invoice}
                onChange={onSetDisplaySettings}
                onCancel={() => setShowDisplaySettings(false)}
              />
            )}
            </DisplaySettingsCell>
        )}
      </Header>
      {items.map(item => (
        <InvoiceItem
          key={item.id}
          item={item}
          project={project}
          onAction={onRemove}
          isEditable={isEditable}
        />
      ))}

    </Styled>
  );
};

export default Generator;
