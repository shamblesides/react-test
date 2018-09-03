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
        if (this.props.children.length > 1) throw new Error('Loader must have only 1 child');
        return this.state.ready ?
            this.props.children[0] :
            (
                <div>loading</div>
            );
    }
}
