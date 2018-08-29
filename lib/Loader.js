import { Component } from 'preact';
import { loadSheets } from './images';

export class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = { ready: false };
    }

    componentDidMount() {
        this.waitForSheets(this.props.sheets);
    }

    componentDidUpdate(prevProps) {
        if (this.props.sheets !== prevProps.sheets) {
            this.waitForSheets(this.props.sheets);
        }
    }

    waitForSheets(sheets) {
        this.setState({ ready: false });
        if (this.props.onloading) this.props.onloading();

        loadSheets(sheets).then(() => {
            this.setState({ ready: true });
            if (this.props.onready) this.props.onready();
        });
    }

    render() {
        return this.state.ready ? this.props.render() : (<div>loading</div>);
    }
}
