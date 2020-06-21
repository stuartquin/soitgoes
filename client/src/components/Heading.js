import React from 'react';
import styled from 'styled-components';

const Heading = ({ size = 'h1', action = null, children }) => {
  const HeadingSize = styled[size]`
    padding: 0;
    magin: 0;
    color: #050505;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  return (
    <HeadingSize>
      {children} {action}
    </HeadingSize>
  );
};

export default Heading;
