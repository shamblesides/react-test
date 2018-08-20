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
        const sprites = Array(100).fill(0).map((_,i)=>i).map(i=>({
            key: Math.random(),
            sheet: sheets.sheet,
            x: Math.random()*50,
            y: Math.random()*50,
        }))

        this.state = { srcs, sprites };

        window.requestAnimationFrame(() => this.loop());
    }

    loop() {
        this.setState({
            ...this.state,
            sprites: this.state.sprites.map(s => ({
                ...s,
                x: s.x-1
            })),
        })
        window.requestAnimationFrame(() => this.loop());
    }

    render() {
        return (
            <div>
            <div style={{backgroundColor:'grey', width: 160, height: 120}}>
                <Screen srcs={this.state.srcs} sprites={this.state.sprites}/>
            </div>
            <div style={{backgroundColor:'grey', width: 160, height: 120}}>
                <Screen srcs={this.state.srcs} sprites={this.state.sprites}/>
            </div>
            </div>
        );
    }
}
