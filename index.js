import { Component } from 'preact';
import Screen from './components/Screen';
import Loader from './components/Loader';
import Pad from './components/Pad';
import { sheets, binds, gameloop } from './game';
import { ROOM_HEIGHT, ROOM_WIDTH } from './game/rooms';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { sheets, binds, sprites: [], };
    }

    registerPad(pad) {
        this.setState({ pad });
    }

    loop() {
        this.setState({ ...gameloop(this.state) })
        window.requestAnimationFrame(() => this.loop());
    }

    render() {
        return (
            <div style={{width: '100%', height: 600}}>
                <Pad binds={this.state.binds} register={pad => this.registerPad(pad)} render={() => (
                    <Loader sheets={this.state.sheets} onready={() => window.requestAnimationFrame(() => this.loop())} render={() => (
                        <div id="ok">
                        <Screen backgroundColor='#45283c' sprites={this.state.sprites} height={ROOM_HEIGHT} width={ROOM_WIDTH}/>
                        </div>
                    )}/>
                )}/>
            </div>
        );
    }
}
