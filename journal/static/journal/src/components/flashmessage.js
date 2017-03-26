import React from 'react';
import { browserHistory } from 'react-router';

import Snackbar from 'material-ui/Snackbar';

const FlashMessage = ({ message, onCloseMessage }) => {
  const isOpen = !message.isEmpty();
  let onTap = null;
  if (isOpen && message.get('link')) {
    onTap = () => {
      browserHistory.push(message.get('link'))
      onCloseMessage();
    };
  }

  return (
    <Snackbar
      open={isOpen}
      message={message.get('text', '')}
      action={message.get('action')}
      autoHideDuration={5000}
      onActionTouchTap={onTap}
      onRequestClose={onCloseMessage}
    />
  );
};

export default FlashMessage;
