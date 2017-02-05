import React from 'react';
import { Link } from 'react-router';

const Crumb = ({route, title}) => {
  const text = `${title} >`;
  return (
    <Link to={route}>{text}</Link>
  );
}

const HeaderBar = (props) => {
  const crumbs = props.crumbs || [];
  return (
    <div className='header-bar'>
      <div className='header-crumbs'>
        {crumbs.map((crumb, idx) => {
          return (
            <Crumb
              key={idx}
              route={crumb.route}
              title={crumb.title}
            />
          );
        })}
      </div>
      <h3>{props.title}</h3>
    </div>
  );
};

export {HeaderBar};
