'use strict';
import React from 'react';

import styles from './styles.css';

class Menu extends React.Component {
  render() {
    if (this.props.isVisible) {
      return (
        <div className={ styles.actionMenu }>
          <ul>
            {this.props.children.map((child) => {
              return (<li>{child}</li>);
            })}
          </ul>
        </div>
      );
    }
    return <div />;
  }
}

export {Menu};
