import React, { Component } from 'react';
import Sprite from './Sprite';
import './Screen.css';

export default class Screen extends Component {
  constructor(props) {
    super(props);
    this.state =  { ready: false };
  }

  componentDidMount() {
    console.log('App componentDidMount')
    this.loadImages(this.props.srcs);
  }

  componentDidUpdate(prevProps) {
    console.log('App componentDidUpdate')
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

    await Promise.all(promises);

    this.setState({ ready: true });
  }

  render() {
    return this.state.ready ? (
      <div className="cancan-wrapper">
        {this.props.sprites.map(sprite => (<Sprite {...sprite}/>))}
      </div>
    ) : (
      <div className="cancan-wrapper">loading</div>
    );
  }
}
