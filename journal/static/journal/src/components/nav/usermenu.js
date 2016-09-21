import React from 'react';

import { Menu } from '../actionmenu/menu';
import styles from './styles.css';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuVisible: false
    };
  }

  toggleMenu() {
    this.setState({isMenuVisible: !this.state.isMenuVisible});
  }

  hideMenu() {
    this.setState({isMenuVisible: false});
  }

  render() {
    const className = `${styles.navbarNav} ${styles.navbarNavRight}`;
    const hash = this.props.version.get('hash', '').substr(0, 8);

    return (
      <ul className={ className }>
        <li className={styles.navItem}>
          <a onClick={() => this.toggleMenu() }>
            <span className='glyphicon glyphicon-option-vertical'></span>
          </a>
          <Menu isVisible={ this.state.isMenuVisible }
            onHideMenu={ () => this.hideMenu() }>
            <button
              className='btn btn-default btn-block'
              onClick={this.props.onLogout}>
              Logout
            </button>
            <hr />
            <span>
              { hash }
            </span>
          </Menu>
        </li>
      </ul>
    );
  }
}

export {UserMenu};
