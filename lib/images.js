const sheetImagedatas = new Map();
const spriteCanvases = new Map();

function getKey({ sheet, sprite=0, colors=null }) {
    return colors ?
        `${sheet.name}:${sprite}:${colors.join(',')}` :
        `${sheet.name}:${sprite}`;
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


export function getImage({ sheet, sprite=0, colors=null }) {
    const key = getKey({ sheet, sprite, colors });

    if (spriteCanvases.has(key)) return spriteCanvases.get(key);

    const nonColorKey = getKey({ sheet, sprite });

    const nonColoredCanvas = createSpriteCanvas(sheet, sprite);
    spriteCanvases.set(nonColorKey, nonColoredCanvas);
    if (!colors) return nonColoredCanvas;

    const coloredCanvas = recolorCanvas(nonColoredCanvas, colors);
    spriteCanvases.set(key, coloredCanvas);
    return coloredCanvas;
}
