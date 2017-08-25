// @flow
import styles from './settings.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Form from 'components/settings/form/Form';

import readStore from 'actions/readStore';

class Settings extends Component {
    componentDidMount() {
        if (this.props.pending !== false) {
            this.props.readStore('settings');
        }
    }

    buildForm() {
        if (this.props.pending === false) {
            return <Form
                    pointId={ parseInt(this.props.pointId) }
                    serverUrl={ this.props.serverUrl }
                    interactionUrl={ this.props.interactionUrl }
                    authToken={ this.props.authToken }
                    notificationEmail={ this.props.notificationEmail }
                />;
        }

        return <div className={ styles.loader + ' loader' }></div>;
    }

    render() {
        return (
            <div className={ styles.container }>
                <div className={styles.title}>
                    <h2>Settings</h2>
                </div>
                { this.buildForm() }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        pending: state.settings.pending,
        pointId: state.settings.pointId,
        serverUrl: state.settings.serverUrl,
        interactionUrl: state.settings.interactionUrl,
        authToken: state.settings.authToken,
        notificationEmail: state.settings.notificationEmail
    };
}

function mapDispatchToProps(dispatch) {
    return {
        readStore: bindActionCreators(readStore, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
