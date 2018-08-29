import { Component } from 'preact';
import { loadSheets } from './images';

export class Loader extends Component {
    waitForSheets(sheets) {
        this.setState({ ready: false });
        if (this.props.onloading) this.props.onloading();

        loadSheets(sheets).then(() => {
            this.setState({ ready: true });
            if (this.props.onready) this.props.onready();
        });
    }

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

    render() {
        return this.state.ready ?
            (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {this.props.children}
                </div>
            ) :
            (<div>loading</div>);
    }
}
