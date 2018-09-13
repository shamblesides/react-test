import { getFlip } from './flip';

const sheetImagedatas = new Map();
const spriteCanvases = new Map();

function getKey({ sheet, sprite=0, flip='', colors=null }) {
    return `${sheet.name}:${sprite}:${flip}:${colors ? colors.join(',') : ''}`;
}

export function loadSheets(sheets) {
    const newSheets = sheets.filter(({ name }) => !sheetImagedatas.has(name));

    const promises = newSheets.map(({ name, src }) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const imagedata = getImagedataFromImg(img);
            sheetImagedatas.set(name, imagedata);
            resolve();
        };
        img.onerror = reject;
        img.src = src;
    }));

    return Promise.all(promises);
}

function getImagedataFromImg(img) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

function createSpriteCanvas({ name, spriteWidth=null, spriteHeight=null }, sprite) {
    const imageData = sheetImagedatas.get(name);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = (spriteWidth || imageData.width);
    canvas.height = (spriteHeight || imageData.height);

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
}

function recolorCanvas(sourceCanvas, colors) {
    // 0x[alpha][blue][green][red]
    const pixelArray = new Uint32Array(sourceCanvas.getContext('2d').getImageData(0,0,sourceCanvas.width,sourceCanvas.height).data.buffer);

    // get all colors
    const imgColors = new Set();
    Array.prototype.forEach.call(pixelArray, rgba => {
        // ignore transparent
        if ((rgba & 0xff000000) !== 0) {
            imgColors.add(rgba);
        }
    });

    // calculate brightness, sort by brightness, and map to our designated palette
    const imgColorsArray = [];
    imgColors.forEach(value => imgColorsArray.push(value));
    const colorMap = new Map();
    imgColorsArray
        .map((rgba) => {
            const brightness = (rgba & 0xff) + ((rgba & 0xff00)>>8) + ((rgba & 0xff0000)>>16);
            return [rgba, brightness];
        }).sort(([_1, b1], [_2, b2]) => b1 - b2)
        .forEach(([rgba], i, arr) => colorMap.set(rgba, colors[Math.floor(colors.length / arr.length * i)]));

    //create sprite
    const canvas = document.createElement('canvas');
    canvas.width = sourceCanvas.width;
    canvas.height = sourceCanvas.height;
    const ctx = canvas.getContext('2d');
    let i = 0;
    for (let y = 0; y < sourceCanvas.height; ++y) {
        for (let x = 0; x < sourceCanvas.width; ++x) {
            if ((pixelArray[i] & 0xff000000) !== 0) {
                ctx.fillStyle = colorMap.get(pixelArray[i]);
                ctx.fillRect(x, y, 1, 1);
            }
            ++i;
        }
    }
    
    return canvas;
}

function flipCanvas(sourceCanvas, flipArgs) {
    const { xflip, yflip, cwrot } = getFlip(flipArgs);
    const { width, height } = sourceCanvas;
    const [a, b] = [
        width*+xflip - sourceCanvas.width*+(xflip) + sourceCanvas.width*+(cwrot),
        height*+yflip - sourceCanvas.height*+yflip,
    ];
    const [left, top] = cwrot ? [b, -a] : [a, b];
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

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

    ctx.drawImage(sourceCanvas, left, top);

    if (cwrot || xflip || yflip) {
        ctx.restore();
    }
    
    return canvas;
}

export function getImage({ sheet, sprite=0, flip='', colors=null }) {
    // try to get it from the cache
    const key = getKey({ sheet, sprite, flip, colors });
    if (spriteCanvases.has(key)) return spriteCanvases.get(key);

    // if it's not cached, get the base sprite from the sheet
    const baseSpriteKey = getKey({ sheet, sprite });
    const baseSpriteCanvas = spriteCanvases.get(baseSpriteKey) || createSpriteCanvas(sheet, sprite);
    if (!spriteCanvases.has(baseSpriteKey)) spriteCanvases.set(baseSpriteKey, baseSpriteCanvas);
    if (baseSpriteKey === key) return baseSpriteCanvas;

    // flip it
    const flippedSpriteKey = getKey({ sheet, sprite, flip });
    const flippedSpriteCanvas = spriteCanvases.get(flippedSpriteKey) || flipCanvas(baseSpriteCanvas, flip);
    if (!spriteCanvases.has(flippedSpriteKey)) spriteCanvases.set(flippedSpriteKey, flippedSpriteCanvas);
    if (flippedSpriteKey === key) return flippedSpriteCanvas;

    // color it
    const coloredSpriteKey = getKey({ sheet, sprite, flip, colors });
    const coloredSpriteCanvas = spriteCanvases.get(coloredSpriteKey) || recolorCanvas(flippedSpriteCanvas, colors);
    if (!spriteCanvases.has(coloredSpriteKey)) spriteCanvases.set(coloredSpriteKey, coloredSpriteCanvas);
    return coloredSpriteCanvas;
}
