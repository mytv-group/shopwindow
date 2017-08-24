// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';

import PreparingOverlay from 'controls/preparing-overlay/PreparingOverlay';

import requestMedia from 'actions/requestMedia';

class MediaRequester extends Component {
    componentDidMount() {
        if ((this.props.isRequesting === null)
             && ((this.props.backgroundFiles.length + this.props.advertisingFiles.length) > 0)
             && this.props.isSettingsValid.call(this)
         ) {
             this.props.requestMedia({
                 url: this.props.serverUrl,
                 pointId: this.props.pointId,
                 date: this.props.now,
                 backgroundFiles: this.props.backgroundFiles,
                 advertisingFiles: this.props.advertisingFiles
             });
             return;
         }
    }

    componentDidUpdate() {
        if ((this.props.isRequesting === false)
            && (this.props.media.items.length > 0)
        ) {
            this.props.stageRiser(5); // 5 - will redirect to Broadcaster
        }

        return false;
    }

    render() {
        if ((this.props.isRequesting === false)
            && (this.props.isRequestingFailed)
        ) {
            return (
                <InvalidOverlay
                    reason='Requesting media failed'
                />
            );
        }

        if ((this.props.isRequesting === false)
            && (this.props.isRequestingFailed)
        ) {
            return (
                <InvalidOverlay
                    reason='Requesting media failed'
                />
            );
        }

        return <PreparingOverlay
               task='Fetching media from server'
           />;
    }
}

function mapStateToProps(state) {
    return {
        isRequesting: state.media.isRequesting,
        isRequestingFailed: state.media.isRequestingFailed,
        media: state.media,
        backgroundFiles: state.schedule.backgroundFiles,
        advertisingFiles: state.schedule.advertisingFiles,
        pointId: state.settings.pointId,
        serverUrl: state.settings.serverUrl,
        authToken: state.settings.authToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        requestMedia: bindActionCreators(requestMedia, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaRequester);
