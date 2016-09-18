import React from 'react';

import styles from './styles.css';

const Version = (props) => {
  if (props.isNew) {
    return (
      <div className={ styles.version }>
        <span className={ styles.versionContent }>
          A new version is available
        </span>
        <a onClick={props.onReload}>
          <strong>Update</strong>
        </a>
      </div>
    );
  }

  return <div />;
};

export { Version };
