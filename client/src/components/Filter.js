import React from 'react';
import { Flex, Text } from 'rebass/styled-components';
import Select from 'react-select';

const SELECT_STYLE = {
  container: provided => ({
    ...provided,
    minWidth: 170,
    flexGrow: 1,
  }),
  control: provided => ({
    ...provided,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: 'none',
  }),
};

const Filter = ({ label, options, onChange, ...props }) => {
  return (
    <Flex
      backgroundColor="grey_lightest"
      color="text"
      variant="smallShadow"
      sx={{ borderRadius: 6 }}
      fontSize="12px"
      {...props}
    >
      <Text p="12px" variant="uppercase" minWidth="80px">
        {label}
      </Text>
      <Select
        styles={SELECT_STYLE}
        options={options}
        onChange={onChange}
        defaultValue={null}
        isMulti
      />
    </Flex>
  );
};

export default Filter;
