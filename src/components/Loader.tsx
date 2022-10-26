import React from 'react';
import ReactLoader from 'react-spinners/ScaleLoader';

interface ILoaderProps {}

const Loader = (props: ILoaderProps) => {
  return (
    <div className='screen-overlay'>
      <ReactLoader
        speedMultiplier={1}
        color='#0088cc'
      />
    </div>
  );
};

export default Loader;
