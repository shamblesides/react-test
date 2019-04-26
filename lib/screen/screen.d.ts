type ScreenArgs = {
    scale?: 'auto' | number = 'auto';
    width: number = 160;
    height: number = 144;
    backgroundColor: string = '#000000';
}

type Sheet = {
    src: string;
    spriteWidth: number;
    spriteHeight: number;
    originX?: number;
    originY?: number;
}

type BasicSprite = {
    sheet: Sheet;
    sprite: number;
    x: number;
    y: number;
    flip: string = null;
    colors: string[] = null;
    cropTop: number = 0;
    cropBottom: number = 0;
    cropLeft: number = 0;
    cropRight: number = 0;
}

type CompositeSprite = {
    sprites: BasicSprite[];
    width: number;
    height: number;
    x: number;
    y: number;
}

type FillSprite = {
    fill: string;
    width: number;
    height: number;
    x: number;
    y: number;
}

type Sprite = BasicSprite | CompositeSprite | FillSprite;

export declare function screen(args: ScreenArgs): {
    el: HTMLCanvasElement,
    updateScreen(sprites: Sprite[]): Promise<void>
}