import React from 'react';
import { Flex, Text } from 'rebass/styled-components';
import Select from 'react-select';

const SELECT_STYLE = {
  control: (provided) => ({
    ...provided,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: 'none',
    width: 170,
  })
};

const Filter = ({ label, options, onChange }) => {
  return (
    <Flex
      backgroundColor="grey_lightest"
      color="text"
      variant="smallShadow"
      sx={{ borderRadius: 6 }}
      fontSize="12px"
    >
      <Text p="12px" variant="uppercase">{label}</Text>
      <Select
        styles={SELECT_STYLE}
        options={options}
        onChange={onChange}
        defaultValue={null}
      />
    </Flex>
  );
};

export default Filter;
