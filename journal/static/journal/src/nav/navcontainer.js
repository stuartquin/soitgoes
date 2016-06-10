import React from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';

import {NavMenu} from './navmenu';
import styles from './styles.css';

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{ width: '100%' }}>
        <header className={styles.navHeader}>
          <NavMenu />
        </header>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
  }
};

const NavContainer = connect(mapStateToProps, mapDispatchToProps)(Nav);
export {NavContainer};
