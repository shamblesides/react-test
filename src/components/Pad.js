import React, { Component } from 'react';

export default class App extends Component {
    onKeyDown(event) {
        console.log(event.key, this.props.binds[event.key]);
    }

    render() {
        return (
            <div
                style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                tabIndex="0"
                onKeyDown={event=>this.onKeyDown(event)}
                />
        );
    }
}
