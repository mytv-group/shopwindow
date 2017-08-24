// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import _upperCase from 'lodash.uppercase';

import PreparingOverlay from 'controls/preparing-overlay/PreparingOverlay';
import InvalidOverlay from 'controls/invalid-overlay/InvalidOverlay';

import ScheduleStoreReader from 'components/configure/schedule-store-reader/ScheduleStoreReader';
import SettingsReader from 'components/configure/settings-reader/SettingsReader';
import ScheduleRequester from 'components/configure/schedule-requester/ScheduleRequester';
import MediaScanner from 'components/configure/media-scanner/MediaScanner';
import MediaRequester from 'components/configure/media-requester/MediaRequester';

import navigate from 'actions/navigate';
import schedule from 'action-chains/schedule';

class Configure extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduleRequesting: true,
            failMessage: 'Failure on configuring pipeline'
        }
    }

    componentDidMount() {
        this.props.schedule().then(
            () => this.props.navigate(['broadcasting']),
            (message) => {
                this.setState({
                    scheduleRequesting: false,
                    failMessage: message
                });
            }
        )
    }

    camelCaseToWords(string) {
        return _upperCase(string.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1"));
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
