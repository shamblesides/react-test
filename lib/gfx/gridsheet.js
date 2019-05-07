import { sprite } from "./sprite";

export function gridSheet(src, spriteWidth, spriteHeight) {
    return ({
        sprite(n, ...transforms) {
            return sprite({ src, spriteWidth, spriteHeight }, n, ...transforms)
        }
    });
}