import React from 'react';
import { getDataUrl } from '../services/images';

export default ({ sheet, sprite, x, y, scale }) => {
    const top = Math.floor(y)*scale;
    const left = Math.floor(x)*scale;
    return (
        <img src={getDataUrl({sheet,sprite,scale})} alt="" style={{position:'absolute',top,left}}/>
    );
}
