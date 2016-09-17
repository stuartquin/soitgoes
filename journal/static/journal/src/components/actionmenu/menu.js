'use strict';
import React from 'react';

import styles from './styles.css';

class Menu extends React.Component {
  render() {
    if (this.props.isVisible) {
      return (
        <div className={ styles.actionMenu }>
          {this.props.children}
        </div>
      );
    }
    return <div />;
  }
}

export {Menu};
