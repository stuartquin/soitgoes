import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const Crumb = ({route, title}) => {
  const text = `${title} >`;
  return (
    <Link to={route}>{text}</Link>
  );
}

const HeaderBar = (props) => {
  return (
    <div className='header-bar'>
      <div className='header-crumbs'>
      </div>
      <h3>{props.title}</h3>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {};
};

const actions = {
};

const HeaderBarContainer = connect(mapStateToProps, actions)(HeaderBar);
export {HeaderBarContainer};
