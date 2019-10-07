import {pane} from './pane.js';
import { gridSheet } from './gridsheet.js';

const ascii = Array(128-32).fill().map((_,i) => String.fromCharCode(i+32)).join('');

// word wrap function by james padolsey
// modified from original
// http://james.padolsey.com/javascript/wordwrap-for-javascript/
function wordwrap(str, width, maxLines) {
    const regex = RegExp('.{0,' +width+ '}(\\s|$)|.{' +width+ '}|.+$', 'g');
    let lines = str.match(regex).slice(0, maxLines);
    if (lines[lines.length-1] === '') lines = lines.slice(0, lines.length-1);
    return lines.map(line => line.trimRight()).join('\n').split('\n');
}

export function font(src, width, height, characterString=ascii) {
    const gridsheet = gridSheet(src, width, height);
    const spriteFor = [...characterString].reduce((hash, letter, i) => {
        hash[letter] = gridsheet.sprite(i);
        return hash;
    }, {});

    return {
        width: gridsheet.width,
        height: gridsheet.height,
        letter(char) {
            return spriteFor[char+''];
        },
        letters(str, maxCols=10000, maxRows=10000) {
            const lines = wordwrap(str+'', maxCols, maxRows);

            const w = gridsheet.width;
            const h = gridsheet.height;

            const cols = Math.max(...lines.map(line => line.length));
            const rows = lines.length;

            const letters = lines.map(
                (line, row) => line
                    .split('')
                    .map((char, col) => spriteFor[char].at(col*w, row*h))
            ).reduce((arr, x) => arr.concat(x));

            const asMulti = pane(w*cols, h*rows, letters);

            return {
                separately() {
                    return { cols, rows, letters };
                },
                single() {
                    return asMulti;
                }
            }
        }
    }
}

