// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';

import PreparingOverlay from 'controls/preparing-overlay/PreparingOverlay';

import readStore from 'actions/readStore';

class ScheduleStoreReader extends Component {
    componentDidMount() {
       if (this.props.isReading !== false) {
           this.props.readStore('schedule', { sufix: this.now });
       }
    }

    componentDidUpdate() {
        if ((this.props.isReading === false)
            && (this.props.scheduleFiles.length === 0)
            && (this.props.settingsPending === null)
        ) {
            this.props.stageRiser(1); // 1 - SettingsReader configure stage
        }

        if ((this.props.isReading === false)
            && (this.props.scheduleFiles.length === 0)
            && (this.props.settingsPending === false)
            && this.props.isSettingsValid()
        ) {
            this.props.stageRiser(2); // 2 - ScheduleRequester configure stage
        }

        if ((this.props.isReading === false)
            && (this.props.scheduleFiles.length > 0)
        ) {
            this.props.stageRiser(3); // 3 - MediaScanner configure stage
        }

        return false;
    }

    render() {
        return <PreparingOverlay
                task='Reading schedule'
            />;
    }
}

ScheduleStoreReader.propTypes = {
    stageRiser: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        isReading: state.schedule.isReading,
        scheduleFiles: state.schedule.backgroundFiles.concat(state.schedule.advertisingFiles),
        settingsPending: state.settings.pending
    };
}

function mapDispatchToProps(dispatch) {
    return {
        readStore: bindActionCreators(readStore, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleStoreReader);
