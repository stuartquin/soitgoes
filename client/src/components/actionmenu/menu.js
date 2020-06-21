'use strict';
import React from 'react';

import styles from './styles.css';

class Menu extends React.Component {
  render() {
    if (this.props.isVisible) {
      return (
        <div className={styles.actionMenu}>
          <ul>
            <li className={styles.actionMenuClose}>
              <a
                className="btn btn-default btn-xs"
                onClick={this.props.onHideMenu}
              >
                <i className="material-icons">close</i>
                <div className="ripple-container"></div>
              </a>
            </li>
            {this.props.children.map((child) => {
              return <li>{child}</li>;
            })}
          </ul>
        </div>
      );
    }
    return <div />;
  }
}

export { Menu };
