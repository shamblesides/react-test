type ScreenArgs = {
    scale?: 'auto' | number = 'auto';
    width: number = 160;
    height: number = 144;
}

type Sheet = {
    src: string;
    spriteWidth: number;
    spriteHeight: number;
    originX?: number;
    originY?: number;
}

type Drawable = {
    ready?: () => Promise<void>,
    draw: (CanvasRenderingContext2D) => void,
};

type PositionableDrawable = {
    at: (x: number, y: number) => Drawable
}

type SpriteTransform = (spriteCanvas: HTMLCanvasElement, sheet: Sheet, sprite: number) => HTMLCanvasElement

export declare function screen(args: ScreenArgs): {
    canvas: HTMLCanvasElement,
    update(sprites: Drawable[]): Promise<void>
}

export declare function sprite(
    sheet: Sheet, sprite: number, ...transforms: SpriteTransform[]
): PositionableDrawable

export declare function multi(
    width: number, height: number, sprites: Drawable[]
): PositionableDrawable

export declare function fill(color: string, x?: number, y?: number, width?: number, height?: number): Drawable

export declare function flip(flip: string): SpriteTransform

export declare function recolor(colors: string[]): SpriteTransform

export declare function crop(crop: { top: boolean, bottom: boolean, left: boolean, right: boolean }): SpriteTransform