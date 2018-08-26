import React from 'react';
import { getDataUrl } from '../services/images';
import './Sprite.css'

export default ({ sheet, sprite, x, y, scale }) => {
    const top = Math.floor(y - (sheet.originY || 0))*scale;
    const left = Math.floor(x - (sheet.originX || 0))*scale;
    return (
        <img src={getDataUrl({sheet,sprite,scale})} alt="" style={{position:'absolute',top,left}}/>
    );
}
