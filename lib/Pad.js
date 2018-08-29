import { Component } from 'preact';
import { TransparentContainer } from './TransparentContainer';

export class Pad extends Component {
    onKeyDown = (event) => {
        const entry = Object.entries(this.props.binds).find(([_,arr]) => arr.includes(event.key));
        if (!entry) return;
        this.setState({ [entry[0]]: { ...this.state[entry[0]], pressed: true } });
    }

    onKeyUp = (event) => {
        const entry = Object.entries(this.props.binds).find(([_,arr]) => arr.includes(event.key));
        if (!entry) return;
        this.setState({ [entry[0]]: { ...this.state[entry[0]], pressed: false } });
    }

    constructor(props) {
        super(props);
        this.state = {};
        Object.keys(props.binds).forEach(name => {
            this.state = { ...this.state, [name]: { pressed: false } };
        });
    }
   
    componentDidMount() {
        const padObj = {
            next: () => ({ ...this.state }),
        };
        if (this.props.register) this.props.register(padObj);
    }

    render() {
        return (
            <TransparentContainer>
                {this.props.children}
                <div
                    style={{ position: 'absolute',top: 0,left: 0,bottom: 0,right: 0 }}
                    tabIndex="0"
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp}
                />
            </TransparentContainer>
        );
    }
}
