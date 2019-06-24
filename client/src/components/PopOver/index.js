import React from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'

import {BREAKPOINTS} from 'components/Grid';


const Styled = styled.div`
  position: relative;
  width: 100%;

  display: flex;
  align-items: flex-start;
  justify-content: center;

`;

const PopOverContent = styled.div`
  background: white;
  z-index: 1;

  border-radius: 4px;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);

  display: flex;
  flex-direction: column;

  position: absolute;
  top: 8px;
  right: -2px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vmax;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 16px;

  border-top: solid 6px white;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const Body = styled.div`
  padding: 12px 16px;
  flex: 1;
  overflow-y: auto;
  text-align: left;
`

const Footer = styled.div`
  background: colorBgGrey;
  padding: 12px 16px;

  display: flex;
  justify-content: flex-end;

  width: 100%;
  box-sizing: border-box;

  & > * {
    margin-left: 8px;
  }
`;

const HeaderActions = styled.div`
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 16px;
`;

const PopOver = ({
  children, title, actions, onClose, headerStyles
}) => {
  return (
    <Styled>
      {onClose ? (
        <Overlay onClick={onClose} />
      ) : (
        <Overlay />
      )}
      <PopOverContent>
        <Header style={headerStyles}>
          <Title>{title}</Title>
        </Header>
        <Body>{children}</Body>

        {actions && (
          <Footer>
            {actions}
          </Footer>
        )}
      </PopOverContent>
    </Styled>
  );
};

export default PopOver;
