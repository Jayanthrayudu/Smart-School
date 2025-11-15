import React from 'react';
import '../../styles/loader.css';

function Loader() {
  return (
    <div className="custom-loader-overlay">
      <div className="custom-loader-spinner"></div>
    </div>
  );
}

export default Loader;
