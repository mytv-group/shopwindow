// @flow
import React, { Component } from 'react';

export default class ReadingSettingsLabel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            counter: 1
        }

        this.interval = null;
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({
                counter: (this.state.counter < 5) ? ++this.state.counter : 1
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    buildDots() {
        return (new Array(this.state.counter).fill('.')).join('');
    }

    render() {
        return (
            <div>
                { this.buildDots() }
            </div>
        );
    }
}
