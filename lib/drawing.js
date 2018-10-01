import { getImage } from './images';

const compositeImages = new Map();

function drawSpriteToContext(ctx, { sheet, sprite, x, y, flip, colors=null }) {
    const image = getImage({ sheet, sprite, flip, colors });
    const left = Math.floor(x - (sheet.originX || 0));
    const top = Math.floor(y - (sheet.originY || 0));

    ctx.drawImage(image, left, top);
}

function getCompositeImage({ sprites, width, height }) {
    const key = sprites;

    if (compositeImages.has(key)) return compositeImages.get(key);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!width || !height) throw new Error('Unknown composite dimensions');
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
    else if (sprite.fill) {
        ctx.fillStyle = sprite.fill;
        ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
    }
    else {
        drawSpriteToContext(ctx, sprite);
    }
}
