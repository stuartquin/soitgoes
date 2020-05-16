import React from 'react';
import { Text, Flex } from 'rebass';
import { Button, SubTitle } from 'components/GUI';
import { asCurrency } from 'services/currency';

const SummaryRow = ({ title, hours, total }) => {
  return (
    <Flex
      p={12}
      flexDirection={['column', 'row']}
      sx={{ overflowX: 'auto' }}
      justifyContent="space-between"
      minWidth="200px"
    >
      <div>
        <strong>{title}</strong>
        <SubTitle>{hours} Hours</SubTitle>
      </div>
      <Text fontSize={[20, 16]} color="grey_dark" py="8px">
        {asCurrency(total, 'GBP')}
      </Text>
    </Flex>
  );
};

export default SummaryRow;
