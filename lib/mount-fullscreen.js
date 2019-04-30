export default function mountFullscreen({ canvas }) {
    document.querySelector('body').appendChild(canvas);

    document.querySelector('html').style.cssText = `
    height: 100%;
    `;
    document.querySelector('body').style.cssText = `
    margin: 0;
    height: 100%;
    `;
    // display: flex;
    // flex-direction: column;

    // document.querySelector('body').appendChild(document.createElement('div'));
    // document.querySelector('body div').id = 'debug';
    // document.querySelector('#debug').style.cssText = `
    // font-family: monospace;
    // background-color: black;
    // color: #0f0;
    // font-size: 6vmin;
    // display: none;
    // `;
}