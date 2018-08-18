import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sprite from './Sprite';

export default class App extends Component {
  constructor(props) {
    super(props);

    const srcs= [logo];

    this.state = { ready: false };
    this.loadImages(srcs).then(images => {
      this.setState({ ready: true, images })
    });
  }

  async loadImages(srcs) {
    return Promise.all(srcs.map(src => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    })));
  }

  render() {
    return this.state.ready ? (
      <div>
        ready
        {this.state.images.map(image => (
          <Sprite image={image}></Sprite>
        ))}
      </div>
    ) : (
      <div>loading</div>
    );
  }
}
