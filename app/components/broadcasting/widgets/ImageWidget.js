// @flow
import React, { Component } from 'react';

export default class ImageWidget extends Component {
    constructor(props) {
        super(props);

        this.offset = parseInt(this.props.config.offset)  * 1000;
        this.showDuration = parseInt(this.props.config.show_duration) * 1000;
        this.periodicity = parseInt(this.props.config.periodicity) * 1000;

        this.isOffsetProcessed = (this.offset !== 0)
            ? false
            : true;

        this.state = {
            isShown: (this.periodicity !== 0)
                ? (this.offset !== 0) ? false : true
                : true
        }
    }

    periodic(showDuration, periodicity) {
        if (this.state.isShown === false) {
            setTimeout(() => {
                this.setState({ isShown: true });
            }, periodicity);
        }

        if (this.state.isShown === true) {
            setTimeout(() => {
                this.setState({ isShown: false });
            }, showDuration);
        }
    }

    cycle() {
        if (this.periodicity === 0) {
            return;
        }

        if (!this.isOffsetProcessed) {
            setTimeout(() => {
                this.isOffsetProcessed = true;
                this.setState({ isShown: true });
            }, this.offset);
            return;
        }

        this.periodic(this.showDuration, this.periodicity);
    }

    componentDidMount() {
        this.cycle();
    }

    componentDidUpdate() {
        this.cycle();
    }

    render() {
        let style = {
            display: this.state.isShown ? 'block' : 'none',
            position: 'absolute',
            top: this.props.window.top + 'px',
            left: this.props.window.left + 'px',
        };

        return (
            <div style={ style }>
                <img src={ this.props.url + this.props.content.img } />
            </div>
        );
    }
}
