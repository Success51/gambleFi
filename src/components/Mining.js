import React, { useState } from 'react';
import './Mining.css';

function Mining() {
    const[activeStatus , isActive] = useState(false);

    function checkNow(){
        isActive(true);

        if(isActive) alert('active');
    }

  return (
    <div className='miningPage'>
      <h1>Comming Soon.</h1>
      </div>
  )
}

export default Mining
