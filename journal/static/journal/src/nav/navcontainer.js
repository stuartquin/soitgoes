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
    const navClasses = `navbar navbar-inverse ${styles.navbar}`;
    return (
      <div>
        <nav className={navClasses}>
          <div className='container'>
            <NavMenu />
          </div>
        </nav>
        <div className='container'>
          {this.props.children}
        </div>
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
