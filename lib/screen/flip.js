import memoize, { byArg0 } from './memoize';

export const getFlip = memoize(byArg0, function getFlip(args) {
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

    return { xflip, yflip, cwrot };
});

