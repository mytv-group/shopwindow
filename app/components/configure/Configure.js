// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import _upperCase from 'lodash.uppercase';

import PreparingOverlay from 'controls/preparing-overlay/PreparingOverlay';
import InvalidOverlay from 'controls/invalid-overlay/InvalidOverlay';

import schedule from 'action-chains/schedule';
import joinSocket from 'action-chains/joinSocket';

import navigate from 'actions/navigate';

class Configure extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduleRequesting: true,
            failMessage: 'Failure on configuring pipeline'
        }
    }

    timeToMidnight() {
        let now = new Date();
        let then = new Date(now);
        then.setHours(24, 0, 0, 0);

        return (then - now);
    }

    componentDidMount() {
        this.props.schedule().then(
            (response) => {
                this.props.joinSocket();

                let toMidnight = this.timeToMidnight();

                setTimeout(() => {
                    this.props.schedule();

                    setInterval(() => {
                        this.props.schedule();
                    }, 86400000);
                }, toMidnight);

                this.props.navigate(['broadcasting']);
            },
            (message) => {
                this.setState({
                    scheduleRequesting: false,
                    failMessage: message
                });
            }
        )
    }

    camelCaseToWords(arg) {
        if (typeof arg === 'string') {
            return _upperCase(arg.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1"));
        }

        if (typeof arg.message === 'string') {
            return _upperCase(arg.message.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1"));
        }

        return 'An unexpected error occurred';
    }

    render() {
        if (this.state.scheduleRequesting) {
            return <PreparingOverlay
                    task='Preparing application for broadcasting'
                />
        }

        return <InvalidOverlay
                reason={ this.camelCaseToWords(this.state.failMessage) }
            />;
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        navigate: bindActionCreators(navigate, dispatch),
        schedule: bindActionCreators(schedule, dispatch),
        joinSocket: bindActionCreators(joinSocket, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
