import { Drawable } from './drawable';
import { memoize } from '../util/memoize';
import { makeCanvas } from '../util/make-canvas';

const sheetImagedatas = new Map(); // sheet{} -> context.getImageData(...)

const loadSheet = memoize(function loadSheet(sheet) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const imagedata = getImagedataFromImg(img);
            sheetImagedatas.set(sheet, imagedata);
            resolve();
        };
        img.onerror = reject;
        img.src = sheet.src;
    });
});

function getImagedataFromImg(img) {
    const [canvas, context] = makeCanvas(img.width, img.height);
    context.drawImage(img, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

const createSpriteCanvas = memoize(function createSpriteCanvas(sheet, sprite=0) {
    const { spriteWidth=null, spriteHeight=null } = sheet;
    const imageData = sheetImagedatas.get(sheet);
    const [canvas, context] = makeCanvas(spriteWidth||imageData.width, spriteHeight||imageData.height)

    const numCols = Math.floor(imageData.width/(spriteWidth || imageData.width));
    const left = (sprite % numCols) * spriteWidth;
    const top = Math.floor(sprite / numCols) * spriteHeight;
    const right = left + (spriteWidth || imageData.width);
    const bottom = top + (spriteHeight || imageData.height);
    
    const data = imageData.data;
    for (let y = top; y < bottom; ++y) {
        for (let x = left; x < right; ++x) {
            const i = 4 * (y*imageData.width+x);
            context.fillStyle = 'rgba('+data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3]+')';
            context.fillRect(x-left, y-top, 1, 1);
        }
    }

    return canvas;
});

function getImage(sheet, sprite, ...transforms) {
    // if it's not cached, get the base sprite from the sheet
    let spriteCanvas = createSpriteCanvas(sheet, sprite);

    for (const t of transforms) {
        spriteCanvas = t(spriteCanvas, sheetImagedatas.get(sheet));
    }

    return spriteCanvas;
}

export function sprite(sheet, sprite, ...transforms) {
    return new Drawable({
        wait() {
            return loadSheet(sheet);
        },
        draw(ctx) {
            const image = getImage(sheet, sprite, ...transforms);

            const left = Math.floor(this.x - (sheet.originX || 0));
            const top = Math.floor(this.y - (sheet.originY || 0));
            ctx.drawImage(image, left, top);
        }
    });
}
