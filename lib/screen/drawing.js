import { getImage, loadSheet } from './images';
import memoize, { byArg0 } from './memoize';

function drawSpriteToContext(ctx, { sheet, sprite, x, y, flip, colors=null, cropTop=0, cropBottom=0, cropLeft=0, cropRight=0 }) {
    const image = getImage({ sheet, sprite, flip, colors });
    const left = Math.floor(x - (sheet.originX || 0));
    const top = Math.floor(y - (sheet.originY || 0));

    const width = image.width - cropLeft - cropRight;
    const height = image.height - cropTop - cropBottom;
    ctx.drawImage(image, cropLeft, cropTop, width, height, left, top, width, height);
}

const getCompositeImage = memoize(s => s.sprites, function getCompositeImage({ sprites, width, height }) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!width || !height) throw new Error('Unknown composite dimensions');
    canvas.width = width;
    canvas.height = height;

    sprites.forEach(sprite => drawSpriteToContext(ctx, sprite));

    return canvas;
});

const readyToDrawComposite = memoize(byArg0, function readyToDrawComposite(sprite) {
    const sheets = sprite.sprites.reduce((set, { sheet }) => set.add(sheet), new Set());
    return Promise.all([...sheets].map(sheet => loadSheet(sheet))).then(() => {});
});

export function readyToDraw(sprite) {
    if (sprite.fill) {
        return Promise.resolve();
    } else if (sprite.sprites) {
        return readyToDrawComposite(sprite);
    } else {
        return loadSheet(sprite.sheet);
    }
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
