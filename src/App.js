import React, { Component } from 'react';
import Screen from './components/Screen';
import charaImg from './sprites/chara.png';

const sheets = {
    chara: {
        src: charaImg,
    }
};

export default class App extends Component {
    constructor(props) {
        super(props)

        const srcs = [charaImg];
        const sprites = [];

        this.state = { srcs, sprites };

        window.requestAnimationFrame(() => this.loop());
    }

    loop() {
        this.setState({
            sprites: [
                // ...this.state.sprites,
                {
                    key: Math.random(),
                    sheet: sheets.chara,
                    x: Math.random()*50,
                    y: Math.random()*50,
                }
            ]
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
