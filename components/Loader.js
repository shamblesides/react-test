import { Component } from 'preact';
import { loadSheets } from '../services/images';

export default class Loader extends Component {
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
    if (this.props.onloading) this.props.onloading();

    await loadSheets(sheets);

    this.setState({ ready: true });
    if (this.props.onready) this.props.onready();
  }

  render() {
    return this.state.ready ? this.props.render() : (<div>loading</div>);
  }
}
