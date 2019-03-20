import { cancan } from './lib';
import gameStuff from './game';
import './index.css';

window.onerror = alert;

const frameSkip = +localStorage.getItem('frameskip') || 1;

const { el } = cancan({ scale: 'auto', frameSkip, ...gameStuff });
document.querySelector('body').appendChild(el);

document.querySelector('body').appendChild(document.createElement('div'));
document.querySelector('body div').id = 'debug';
