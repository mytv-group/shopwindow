// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';

import PreparingOverlay from 'controls/preparing-overlay/PreparingOverlay';

import scanMedia from 'actions/scanMedia';

class MediaScanner extends Component {
    componentDidMount() {
        if ((this.props.isScanning !== false)
            && (this.props.scheduleFiles.length > 0)
            && this.props.isSettingsValid.call(this)
        ) {
            this.props.scanMedia({
                pointId: this.props.pointId,
                date: this.props.now
            });
        }
    }

    componentDidUpdate() {
        if ((this.props.isScanning === false)
            && (this.props.media.items.length > 0)
            && (this.props.scheduleFiles.length === this.props.media.items.length)
        ) {
            this.props.stageRiser(5); // 5 - complete, Configure Component will navigate to broadcaster
        }

        if ((this.props.isScanning === false)
            && (this.props.scheduleFiles.length > this.props.media.items.length)
            && this.props.isSettingsValid.call(this)
        ) {
            this.props.stageRiser(4); // 4 - MediaRequester configure stage
        }

        return false;
    }

    render() {
        return (
            <PreparingOverlay
                task='Scanning files'
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        isScanning: state.media.isScanning,
        scheduleFiles: state.schedule.backgroundFiles.concat(state.schedule.advertisingFiles),
        media: state.media,
        pointId: state.settings.pointId,
        serverUrl: state.settings.serverUrl,
        authToken: state.settings.authToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        scanMedia: bindActionCreators(scanMedia, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaScanner);
