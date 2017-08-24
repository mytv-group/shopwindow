// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PreparingOverlay from 'controls/preparing-overlay/PreparingOverlay';
import InvalidOverlay from 'controls/invalid-overlay/InvalidOverlay';

import readStore from 'actions/readStore';

class SettingsReader extends Component {
    componentDidMount() {
       if (this.props.pending !== false) {
           this.props.readStore('settings');
       }
    }

    componentDidUpdate() {
        if ((this.props.pending === false)
            && this.props.isSettingsValid.call(this)
        ) {
            this.props.stageRiser(2); // 2 - ScheduleRequester configure stage
            return false;
        }

        return true;
    }

    render() {
        if ((this.props.pending === false) && !this.props.isSettingsValid.call(this)) {
            return <InvalidOverlay
                      reason='Invalid server settings. Please configure application for correct operating'
                   />
        }

        return <PreparingOverlay
                  task='Reading settings'
               />
    }
}

function mapStateToProps(state) {
    return {
        pending: state.settings.pending,
        pointId: state.settings.pointId,
        serverUrl: state.settings.serverUrl,
        authToken: state.settings.authToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        readStore: bindActionCreators(readStore, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsReader);
