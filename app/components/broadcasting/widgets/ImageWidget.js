// @flow
import React, { Component } from 'react';

export default class ImageWidget extends Component {
    render() {
        let style = {
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
