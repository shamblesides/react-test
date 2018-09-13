import { getImage } from './images';
import { getFlip } from './flip';

const compositeImages = new Map();

function drawSpriteToContext(ctx, { sheet, sprite, x, y, flip, colors=null }) {
    const { width, height } = ctx.canvas;
    const image = getImage({ sheet, sprite, colors });
    const { xflip, yflip, cwrot } = getFlip(flip);
    const [a, b] = [
        width*+xflip + Math.floor(x)*(xflip?-1:1) - (sheet.originX||0)*(xflip?-1:1) - image.width*+(xflip) + image.width*+(cwrot),
        height*+yflip + Math.floor(y)*(yflip?-1:1) - (sheet.originY||0)*(yflip?-1:1) - image.height*+yflip,
    ];
    const [left, top] = cwrot ? [b, -a] : [a, b];
    
    ctx.save();

    if (cwrot || xflip || yflip) {
        ctx.setTransform(
            +!cwrot && (xflip?-1:1),
            +cwrot && (yflip?-1:1),
            +cwrot && (xflip?1:-1),
            +!cwrot && (yflip?-1:1),
            width*(+xflip),
            height*(+yflip)
        );
    }

    ctx.drawImage(image, left, top);

    if (cwrot || xflip || yflip) {
        ctx.restore();
    }
}

function getCompositeImage({ sprites, width, height }) {
    const key = sprites;

    if (compositeImages.has(key)) return compositeImages.get(key);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    sprites.forEach(sprite => drawSpriteToContext(ctx, sprite));

    compositeImages.set(key, canvas);
    return canvas;
}

export function drawToContext(ctx, sprite) {
    if (sprite.sprites) {
        const image = getCompositeImage(sprite);
        ctx.drawImage(image, sprite.x || 0, sprite.y || 0);
    }
    else {
        drawSpriteToContext(ctx, sprite);
    }
}
