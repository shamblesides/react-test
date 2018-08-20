const imageDatas = new Map();
const dataUrls = new Map();

function getKey({src,scale=1}) {
    return `${src}:${scale}`;
}

export async function loadImages(srcs) {
    const newSrcs = srcs.filter(src => !imageDatas.has(src));

    const promises = newSrcs.map(src => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            addImageData(src, img);
            resolve();
        };
        img.onerror = reject;
        img.src = src;
    }));

    await Promise.all(promises);
}

function addImageData(src, img) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    imageDatas.set(src, context.getImageData(0, 0, canvas.width, canvas.height));
    dataUrls.set(getKey({src, scale:1}), canvas.toDataURL('image/png'));
}

function getScaledDataUrl(imageData, scale) {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width * scale;
    canvas.height = imageData.height * scale;
    const context = canvas.getContext('2d');
    
    const data = imageData.data;
    let i = 0;
    for(let y = 0; y < imageData.height; ++y) {
        for(let x = 0; x < imageData.width; ++x) {
            context.fillStyle = 'rgba('+data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3]+')';
            context.fillRect(x*scale, y*scale, scale, scale);
            i+=4; // r,g,b,a
        }
    }
    
    return canvas.toDataURL('image/png');
}

export function getDataUrl({src,scale}) {
    const key = getKey({src, scale});

    if (dataUrls.has(key)) return dataUrls.get(key);

    const scaledDataUrl = getScaledDataUrl(imageDatas.get(src), scale);
    dataUrls.set(key, scaledDataUrl);
    return scaledDataUrl;
}
