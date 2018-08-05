import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Loading = (props) => {
  return (
    <div className='loading'>
      <CircularProgress />
    </div>
  );
};

export {Loading};
