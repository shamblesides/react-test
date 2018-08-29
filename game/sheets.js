import groundPng from './sprites/ground.png'
import guysPng from './sprites/guys.png'
import propsPng from './sprites/props.png'

export const sheets = [
    {
        name: 'guys',
        src: guysPng,
        spriteWidth: 16,
        spriteHeight: 16,
        originX: 8,
        originY: 8,
    },
    {
        name: 'ground',
        src: groundPng,
        spriteWidth: 4,
        spriteHeight: 8,
        originX: 0,
        originY: 0,
    },
    {
        name: 'props',
        src: propsPng,
        spriteWidth: 32,
        spriteHeight: 32,
        originX: 16,
        originY: 32,
    }
];
