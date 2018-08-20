const imgs = new Map();
const scaledImgs = new Map();

function key({src,scale=1}) {
    return `${src},${scale}`;
}

export async function loadImages(srcs) {
    const promises = urls.map(src => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve([src, img]);
        img.onerror = reject;
        img.src = src;
    }));

    const entries = await Promise.all(promises);
    entries.forEach(([src,img] => images.set(key({src}), img)));
    dataUrls.forEach(src => images.set(key({src}), src))
}


export function getScaledImageSrc({src,scale}) {
    return src;
}