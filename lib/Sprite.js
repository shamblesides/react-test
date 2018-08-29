import { getDataUrl } from './images';
import './Sprite.css';

function applyFlip(args) {
    let xflip, yflip, cwrot;
    (args || '')
        .replace('90','c')
        .replace('180','xy')
        .replace('270','xy')
        .split('')
        .forEach(flip => {
            if(flip === 'x' || flip === 'h') xflip = !xflip;
            else if(flip === 'y' || flip === 'v') yflip = !yflip;
            else if(flip === 'c') {
                if(cwrot) {
                    xflip = !xflip;
                    yflip = !yflip;
                }
                cwrot = !cwrot;
                [xflip, yflip] = [yflip, xflip];
            }
        })

    return {xflip, yflip, cwrot};
}

export const Sprite = ({ sheet, sprite, x, y, scale, flip }) => {
    const top = Math.floor(y - (sheet.originY || 0))*scale;
    const left = Math.floor(x - (sheet.originX || 0))*scale;
    const { xflip, yflip, cwrot } = applyFlip(flip);
    const style = {
        position: 'absolute',
        top,
        left,
        transform: `scale(${xflip?-1:1}, ${yflip?-1:1}) rotate(${cwrot?90:0}deg)`,
    }
    return (
        <img src={getDataUrl({sheet,sprite,scale})} alt="" style={style}/>
    );
}
