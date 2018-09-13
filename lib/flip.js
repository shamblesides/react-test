const flipMap = new Map();

export function getFlip(args) {
    if (flipMap.has(args)) return flipMap.get(args);

    let xflip = false, yflip = false, cwrot = false;
    (args || '')
        .replace('90','c')
        .replace('180','xy')
        .replace('270','xy')
        .split('')
        .forEach(flip => {
            if (flip === 'x' || flip === 'h') xflip = !xflip;
            else if (flip === 'y' || flip === 'v') yflip = !yflip;
            else if (flip === 'c') {
                if (cwrot) {
                    xflip = !xflip;
                    yflip = !yflip;
                }
                cwrot = !cwrot;
                [xflip, yflip] = [yflip, xflip];
            }
        });

    flipMap.set(args, { xflip, yflip, cwrot });
    return { xflip, yflip, cwrot };
}

