import React, { Component } from 'react';
import Sprite from './Sprite';
import './Screen.css';
import {loadImages} from '../services/images';

export default class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
  }

  async componentDidMount() {
    this.waitForImages(this.props.srcs);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.srcs !== prevProps.srcs) {
      this.waitForImages(this.props.srcs);
    }
  }

  async waitForImages(srcs) {
    this.setState({ ready: false });
    await loadImages(srcs);
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
