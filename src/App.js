import React, { Component } from 'react';
import Screen from './components/Screen';
import charaImg from './sprites/chara.png';
import sheetImg from './sprites/sheet.png';

const sheets = {
    chara: {
        src: charaImg,
    },
    sheet: {
        src: sheetImg,
    },
};

export default class App extends Component {
    constructor(props) {
        super(props)

        const srcs = [charaImg, sheetImg];
        const sprites = Array(1).fill(0).map((_,i)=>i).map(i=>({
            key: Math.random(),
            sheet: sheets.sheet,
            x: 50,
            y: 50,
        }))

        this.state = { srcs, sprites };

        window.requestAnimationFrame(() => this.loop());
    }

    loop() {
        this.setState({
            ...this.state,
            sprites: this.state.sprites.map(s => ({
                ...s,
                x: s.x+Math.sin(Date.now()/300)
            })),
        })
        window.requestAnimationFrame(() => this.loop());
    }

    render() {
        return (
            <div style={{backgroundColor:'grey', width: 600, height: 600}}>
                <Screen srcs={this.state.srcs} sprites={this.state.sprites}/>
            </div>
        );
    }
}
