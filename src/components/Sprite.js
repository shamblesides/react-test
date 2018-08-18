import React, { Component } from 'react';

export default class Sprite extends Component {
    render() {
        return (
            <canvas ref="canvas" width={300} height={300}/>
        );
    }
    componentDidMount() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.drawImage(this.props.image, 0, 0);
    }
}
