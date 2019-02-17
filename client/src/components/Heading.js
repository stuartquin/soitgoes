import React from 'react';
import styled from 'styled-components';

const Heading = ({size = 'h1', children}) => {
  const HeadingSize = styled[size]`
    padding: 0;
    magin: 0;
    color: #050505;
  `;

  return <HeadingSize>{children}</HeadingSize>
};

export default Heading;
