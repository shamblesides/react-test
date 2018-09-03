import { Component } from 'preact';
import { Screen, Loader, Pad } from './lib';
import { gameloop, binds, sheets, ROOM_HEIGHT, ROOM_WIDTH } from './game';

export class Game extends Component {
    destroyed = false;

    registerPad = (pad) => {
        this.setState({ pad });
    }

    loop = () => {
        if (this.destroyed) return;
        window.requestAnimationFrame(() => {
            this.setState({ ...gameloop(this.state) });
            this.loop();
        });
    }

    constructor(props) {
        super(props);
        this.state = { sheets, binds, sprites: [] };
    }

    componentWillUnmount() {
        this.destroyed = true;
    }

    render() {
        return (
            <Pad binds={this.state.binds} register={this.registerPad}>
                <Loader sheets={this.state.sheets} onready={this.loop}>
                    <Screen backgroundColor="#45283c" sprites={this.state.sprites} height={ROOM_HEIGHT} width={ROOM_WIDTH} scale={this.props.scale} />
                </Loader>
            </Pad>
        );
    }
}
