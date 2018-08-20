import React from 'react';

export default ({ sheet, x, y }) => {
    return (
        <img src={sheet.src} alt="" style={{position:'absolute',top:x,left:y}}/>
    );
}
