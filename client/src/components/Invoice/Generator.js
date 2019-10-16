import React, {useState} from 'react';
import styled from 'styled-components';
import { Box, Text } from 'rebass/styled-components';
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

const DisplaySettingsCell = styled(Box)`
  position: relative;
`;

const Generator = ({
  invoice, items, project, onRemove, onSetDisplaySettings
}) => {
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const isEditable = !Boolean(invoice.issued_at);

  return (
    <Styled>
      <Header justifyContent="flexEnd" flexWrap="wrap">
        <Box flexGrow="1">Item</Box>
        <Box minWidth="80px" display={['none', 'initial']}>
          <Text textAlign="right">Unit</Text>
        </Box>
        <Box minWidth={['80px', '120px']}>
          <Text textAlign="right">Total</Text>
        </Box>
        {isEditable && (
          <DisplaySettingsCell ml={3}>
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
