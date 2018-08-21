import React, { Component } from 'react';
import Sprite from './Sprite';
import './Screen.css';
import { loadSheets } from '../services/images';

export default class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
  }

  async componentDidMount() {
    this.waitForSheets(this.props.sheets);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.sheets !== prevProps.sheets) {
      this.waitForSheets(this.props.sheets);
    }
  }

  async waitForSheets(sheets) {
    this.setState({ ready: false });
    await loadSheets(sheets);
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
