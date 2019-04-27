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

type Drawable = {
    ready?: () => Promise<void>,
    draw: (CanvasRenderingContext2D) => void,
};

type PositionableDrawable = {
    at: (x: number, y: number) => Drawable
}

export declare function screen(args: ScreenArgs): {
    canvas: HTMLCanvasElement,
    update(sprites: Drawable[]): Promise<void>
}

export declare function sprite(
    sheet: Sheet, sprite: number, flip?: string, colors?: string[], crop?: {left: number, right: number, top: number, bottom: number}
): PositionableDrawable

export declare function multi(
    width: number, height: number, sprites: Drawable[]
): PositionableDrawable

export declare function fill(color: string, x: number, y: number, width: number, height: number): Drawable