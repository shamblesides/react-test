import React from 'react';
import { getScaledImage } from '../services/images';

export default ({ sheet, x, y }) => {
    return (
        <img src={getScaledImage({src:sheet.src,scale:2})} alt="" style={{position:'absolute',top:x,left:y}}/>
    );
}
