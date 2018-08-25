import React, { Component } from 'react';
import Screen from './components/Screen';
import Loader from './components/Loader';
import Pad from './components/Pad';
import charaImg from './sprites/chara.png';
import sheetImg from './sprites/sheet.png';


export default class App extends Component {
    constructor(props) {
        super(props)

        const sheets = [
            {
                name: 'chara',
                src: charaImg,
                spriteWidth: 20,
                spriteHeight: 20,
            },
            {
                name: 'sheet',
                src: sheetImg,
                spriteWidth: 16,
                spriteHeight: 16,
            },
        ];
        const sprites = Array(1).fill(0).map((_,i)=>i).map(i=>({
            key: Math.random(),
            sheet: sheets.find(s=>s.name==='chara'),
            sprite: 0,
            x: i*5,
            y: i*5,
        }));
        const binds = {
            'up': ['ArrowUp', 'w'],
            'left': ['ArrowLeft', 'a'],
            'down': ['ArrowDown', 's'],
            'right': ['ArrowRight', 'd'],
            'ok': ['Enter', ' '],
        };

        this.state = { sheets, sprites, binds };
    }

    registerPad(pad) {
        this.setState({ pad });
    }

    loop() {
        const pad = this.state.pad.next();
        let x = 0, y = 0;
        if (pad.up.pressed) --y;
        if (pad.down.pressed) ++y;
        if (pad.left.pressed) --x;
        if (pad.right.pressed) ++x;

        this.setState({
            sprites: this.state.sprites.map(s => ({
                ...s,
                x: s.x+x,
                y: s.y+y,
                sprite: Math.floor(Date.now() / 500) % 3
            }))
        });

        window.requestAnimationFrame(() => this.loop());
    }

    render() {
        return (
            <div style={{backgroundColor:'grey', width: '100%', height: 600}}>
                <Pad binds={this.state.binds} register={pad => this.registerPad(pad)} render={() => (
                    <Loader sheets={this.state.sheets} onready={() => window.requestAnimationFrame(() => this.loop())} render={() => (
                        <Screen sprites={this.state.sprites} height={10} width={10} showOverflow/>
                    )}/>
                )}/>
            </div>
        );
    }
}
