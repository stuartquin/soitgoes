import React from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'

import {BREAKPOINTS} from 'components/Grid';


const Styled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  display: flex;
  align-items: flex-start;
  justify-content: center;

`;

const DialogContent = styled.div`
  background: white;
  z-index: 1;

  width: 100%;
  height: 100%;

  @media(min-width: ${BREAKPOINTS.md}) {
    max-width: 570px;
    height: auto;
    margin-top: 100px;
    box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
    border-radius: 4px;
  }
`;

const Overlay = styled.div`
  position: absolute;

  background: rgba(120,120,120,0.4);
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
`;

const DialogBody = styled.div`
  padding: 12px 16px;
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
  font-size: 20px;
`;

const Dialog = ({
  children, title, actions, onClose, headerStyles
}) => {
  return (
    <Styled>
      {onClose ? (
        <Overlay onClick={onClose} />
      ) : (
        <Overlay />
      )}
      <DialogContent>
        <Header style={headerStyles}>
          <Title>{title}</Title>
          {onClose && (
            <HeaderActions>
              <FontAwesomeIcon
                icon={faTimes}
                onClick={onClose}
              />
            </HeaderActions>
          )}
        </Header>
        <DialogBody>{children}</DialogBody>

        {actions && (
          <Footer>
            {actions}
          </Footer>
        )}
      </DialogContent>
    </Styled>
  );
};

export default Dialog;
