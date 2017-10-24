// @flow
import styles from './player.scss';

import React, { Component } from 'react';

export default class Player extends Component {
    componentDidMount() {
        this.autoPlay();
    }

    componentDidUpdate() {
        this.autoPlay();
    }

    componentWillUnmount() {
        this.refs.video.pause();
        this.refs.video.src='';
    }

    autoPlay() {
        this.refs.video.play();
        this.refs.video.currentTime = parseInt(this.props.offset) || 0;

        if (process.env.NODE_ENV === 'development') {
            this.refs.video.volume = 0;
        }
    }

    render() {
        return (
            <section className={ styles.player }>
                <video
                    width='100%'
                    ref='video'
                    src={ this.props.path }
                ></video>
            </section>
        );
    }
}
