import React from 'react';
import {Link} from 'react-router';

import styles from './styles.css';

const HeaderLogo = (props) => {
  'use strict';
  const className = `navbar-header ${styles.headerLogo}`;

  return (
    <div className={className}>
      <div className='navbar-brand'>
        <Link to={'/'}>
          <img src='static/journal/assets/logo.png' />
        </Link>
      </div>
    </div>
  );
};

export {HeaderLogo};
