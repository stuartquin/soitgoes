import React from 'react';
import { Box, Text } from 'rebass/styled-components';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

import { BREAKPOINTS, Grid, Cell } from 'components/Grid';
import { ActionLink, Divider } from 'components/GUI';
import { asCurrency } from 'services/currency';

const UpcomingInvoice = ({ summary }) => {
  const { project, total } = summary;
  const url = `/invoices/${project.id}/invoice`;
  return (
    <Box px={16} py="12px" minWidth={200}>
      <Text>{project.name}</Text>
      <Text fontSize={22} color="grey_dark" py="8px">
        {asCurrency(total, project.currency)}
      </Text>
      <ActionLink as={Link} to={url}>
        Issue &raquo;
      </ActionLink>
      <Divider mt="16px" display={['none', 'block']} />
    </Box>
  );
};

export default UpcomingInvoice;
