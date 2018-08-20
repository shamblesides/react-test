import React from 'react';
import { getDataUrl } from '../services/images';

export default ({ sheet, x, y }) => {
    const scale=2;
    const top = Math.floor(y)*scale;
    const left = Math.floor(x)*scale;
    return (
        <img src={getDataUrl({src:sheet.src,scale})} alt="" style={{position:'absolute',top,left}}/>
    );
}
