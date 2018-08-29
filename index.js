import { Component } from 'preact';
import { Screen, Loader, Pad } from './lib';
import { gameloop, binds, sheets, ROOM_HEIGHT, ROOM_WIDTH } from './game';

export default class App extends Component {
    registerPad(pad) {
        this.setState({ pad });
    }

    loop() {
        this.setState({ ...gameloop(this.state) });
        window.requestAnimationFrame(() => this.loop());
    }

    constructor(props) {
        super(props);
        this.state = { sheets, binds, sprites: [] };
    }

    render() {
        return (
            <div style={{ width: '100%', height: 600 }}>
                <Pad binds={this.state.binds} register={pad => this.registerPad(pad)} render={() => (
                    <Loader sheets={this.state.sheets} onready={() => window.requestAnimationFrame(() => this.loop())} render={() => (
                        <Screen backgroundColor="#45283c" sprites={this.state.sprites} height={ROOM_HEIGHT} width={ROOM_WIDTH} />
                    )}
                    />
                )}
                />
            </div>
        );
    }
}
