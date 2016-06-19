import React from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';

import {NavMenu} from './navmenu';
import styles from './styles.css';
import * as projectActions from '../actions/projects';

class Nav extends React.Component {
  componentDidMount() {
    this.props.fetchProjects();
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

const actions = {
  ...projectActions
};

const NavContainer = connect(mapStateToProps, actions)(Nav);
export {NavContainer};
