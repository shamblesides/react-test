import React from 'react';
import Sprite from './Sprite';
import './Screen.css';

export default ({sprites}) => (
  <div className="cancan-wrapper">
    {sprites.map(sprite => (<Sprite {...sprite}/>))}
  </div>
);
