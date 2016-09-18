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

  render() {
    const className = `${styles.navbarNav} ${styles.navbarNavRight}`;
    const hash = this.props.version.get('hash', '').substr(0, 8);

    return (
      <ul className={ className }>
        <li className={styles.navItem}>
          <a onClick={() => this.toggleMenu() }>
            {this.props.user.get('username')}
            <Menu isVisible={ this.state.isMenuVisible }>
              <a onClick={this.props.onLogout}>
                Logout
              </a>
              <hr />
              <span>
                { hash }
              </span>
            </Menu>
          </a>
        </li>
      </ul>
    );
  }
}

export {UserMenu};
