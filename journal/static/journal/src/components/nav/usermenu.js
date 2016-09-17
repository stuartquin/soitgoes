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
    const className = `nav navbar-nav navbar-right ${styles.navbarNavRight}`;

    return (
      <ul className={ className }>
        <li>
          <a onClick={() => this.toggleMenu() }>
            {this.props.user.get('username')}
          </a>
          <Menu isVisible={ this.state.isMenuVisible }>
            <a onClick={this.props.onLogout}>
              Logout
            </a>
          </Menu>
        </li>
      </ul>
    );
  }
}

export {UserMenu};
