import React from 'react';
import {Link} from 'react-router';

import styles from './styles.css';

const HeaderLogo = (props) => {
  return (
    <div className={styles.headerLogo}>
      <div className={styles.headerBrand}>
        <Link to={'/dash'}>
          <img src='/static/journal/assets/logo.png' />
        </Link>
      </div>
    </div>
  );
};

export {HeaderLogo};
