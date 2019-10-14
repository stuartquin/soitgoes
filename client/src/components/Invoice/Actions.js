import React from 'react';
import { Box, Flex } from 'rebass';

import {Button, ActionLink} from 'components/GUI';

const getStatusAction = (invoice, onUpdateStatus) => {
  if (!invoice.status) {
    return (
      <Button type="success" onClick={() => onUpdateStatus('ISSUED')}>
        Issue
      </Button>
    );
  }
  if (invoice.status === 'ISSUED') {
    return (
      <Button type="success" onClick={() => onUpdateStatus('PAID')}>
        Set Paid
      </Button>
    );
  }

  return null;
};

const Actions = ({invoice, onUpdateStatus, onDelete}) => {
  const isIssued = Boolean(invoice.status);

  return (
    <Flex alignItems="center">
      {isIssued ? (
        <ActionLink size="sm" type="danger">Delete</ActionLink>
      ): <div />}
      <Box ml={12}>
        {getStatusAction(invoice, onUpdateStatus)}
      </Box>
    </Flex>
  );
};

export default Actions;
