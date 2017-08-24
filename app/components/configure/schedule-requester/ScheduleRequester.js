// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';

import PreparingOverlay from 'controls/preparing-overlay/PreparingOverlay';

import requestSchedule from 'actions/requestSchedule';

class ScheduleRequester extends Component {
    componentDidMount() {
        if ((this.props.isRequesting === null)
             && (this.props.scheduleFiles.length === 0)
             && this.props.isSettingsValid.call(this)
         ) {
             this.props.requestSchedule({
                 url: this.props.serverUrl,
                 id: this.props.pointId,
                 date: this.props.now
             });
             return;
         }
    }

    componentDidUpdate() {
        if ((this.props.isRequesting === false)
            && (this.props.scheduleFiles.length > 0)
            && this.props.isSettingsValid.call(this)
        ) {
            this.props.stageRiser(3); // 3 - MediaScanner configure stage
        }

        return false;
    }

    render() {
        if ((this.props.isRequesting === false)
            && (this.props.isBadRequest)
        ) {
            return (
                <InvalidOverlay
                    reason='Server responded <<Bad Request>>'
                />
            );
        }

        if ((this.props.isRequesting === false)
            && ((this.props.isNotFound) || (this.props.scheduleFiles.lenght === 0))
        ) {
            return (
                <InvalidOverlay
                    reason='No planned content for point on server'
                />
            );
        }

        if ((this.props.isRequesting === false)
            && ((this.props.isNotFound) || (this.props.scheduleFiles.lenght === 0))
        ) {
            return (
                <InvalidOverlay
                    reason='No planned content for point on server'
                />
            );
        }

        return <PreparingOverlay
               task='Fetching data from server'
           />;
    }
}

function mapStateToProps(state) {
    return {
        isReading: state.schedule.isReading,
        isRequesting: state.schedule.isRequesting,
        isBadRequest: state.schedule.isBadRequest,
        isNotFound: state.schedule.isNotFound,
        scheduleFiles: state.schedule.backgroundFiles.concat(state.schedule.advertisingFiles),
        pointId: state.settings.pointId,
        serverUrl: state.settings.serverUrl,
        authToken: state.settings.authToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        requestSchedule: bindActionCreators(requestSchedule, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleRequester);
