import { Component } from 'preact';
import { Screen, Loader, Pad } from './lib';
import { gameloop, binds, sheets, ROOM_HEIGHT, ROOM_WIDTH } from './game';

export class Game extends Component {
    destroyed = false;

    registerPad = (pad) => {
        this.setState({ pad });
        this.loop();
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
            <Loader sheets={this.state.sheets}>
                <Screen backgroundColor="#45283c" sprites={this.state.sprites} height={ROOM_HEIGHT} width={ROOM_WIDTH} scale={this.props.scale}>
                    <Pad binds={this.state.binds} register={this.registerPad} />
                </Screen>
            </Loader>
        );
    }
}
