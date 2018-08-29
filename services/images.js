const sheetImageDatas = new Map();
const dataUrls = new Map();

function getKey({sheet,sprite=0,scale=1}) {
    return `${sheet.name}:${sprite}:${scale}`;
}

export async function loadSheets(sheets) {
    const newSheets = sheets.filter(({name}) => !sheetImageDatas.has(name));

    const promises = newSheets.map(({name, src, spriteWidth, spriteHeight}) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            addImageData(name, img, spriteWidth, spriteHeight);
            resolve();
        };
        img.onerror = reject;
        img.src = src;
    }));

    await Promise.all(promises);
}

function addImageData(name, img, spriteWidth, spriteHeight) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    sheetImageDatas.set(name, context.getImageData(0, 0, canvas.width, canvas.height));
}

function getScaledDataUrl({name,spriteWidth=null,spriteHeight=null}, sprite, scale) {
    const imageData = sheetImageDatas.get(name);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = (spriteWidth || imageData.width) * scale;
    canvas.height = (spriteHeight || imageData.height) * scale;

    const numCols = Math.floor(imageData.width/(spriteWidth || imageData.width));
    const left = (sprite % numCols) * spriteWidth;
    const top = Math.floor(sprite / numCols) * spriteHeight;
    const right = left + (spriteWidth || imageData.width);
    const bottom = top + (spriteHeight || imageData.height);
    
    const data = imageData.data;
    for(let y = top; y < bottom; ++y) {
        for(let x = left; x < right; ++x) {
            const i = 4 * (y*imageData.width+x);
            context.fillStyle = 'rgba('+data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3]+')';
            context.fillRect((x-left)*scale, (y-top)*scale, scale, scale);
        }
    }
    
    return canvas.toDataURL('image/png');
}

export function getDataUrl({sheet,sprite=0,scale}) {
    const key = getKey({sheet, sprite, scale});

    if (dataUrls.has(key)) return dataUrls.get(key);

    const scaledDataUrl = getScaledDataUrl(sheet, sprite, scale);
    dataUrls.set(key, scaledDataUrl);
    return scaledDataUrl;
}
