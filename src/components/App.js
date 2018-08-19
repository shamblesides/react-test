import React, { Component } from 'react';
import Sprite from './Sprite';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state =  { ready: false };
  }

  componentDidMount() {
    this.loadImages(this.props.srcs);
  }

  componentDidUpdate(prevProps) {
    if (this.props.srcs !== prevProps.srcs) {
      this.loadImages(this.props.srcs);
    }
  }

  async loadImages(srcs) {
    this.setState({ ready: false });

    const promises = srcs.map(src => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    }));

    const images = await Promise.all(promises);

    this.setState({ ready: true, images });
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
