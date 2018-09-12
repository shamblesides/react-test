import { Component } from 'preact';
import { Screen, loadSheets, pad as padFactory } from './lib';
import { gameloop, binds, sheets, ROOM_HEIGHT, ROOM_WIDTH } from './game';

export class Game extends Component {
    destroyed = false;
    padElementAttributes = null;

    loop = () => {
        if (this.destroyed) return;
        window.requestAnimationFrame(() => {
            this.setState({ ...gameloop(this.state) });
            this.loop();
        });
    }

    constructor(props) {
        super(props);
        const { elementAttributes, pad } = padFactory(binds);
        this.padElementAttributes = elementAttributes;
        this.state = { pad };
        loadSheets(sheets).then(() => this.loop());
    }

    componentWillUnmount() {
        this.destroyed = true;
    }

    render() {
        return (
            <Screen backgroundColor="#45283c" sprites={this.state.sprites} height={ROOM_HEIGHT} width={ROOM_WIDTH} scale={this.props.scale} {...this.padElementAttributes} />
        );
    }
}
