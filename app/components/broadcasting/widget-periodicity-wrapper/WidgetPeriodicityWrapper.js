// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import WidgetMediatypeWrapper  from 'components/broadcasting/widget-mediatype-wrapper/WidgetMediatypeWrapper';

export default class WidgetPeriodicityWrapper extends Component {
    constructor(props) {
        super(props);

        this.url = this.props.options.url;
        this.offset = parseInt(this.props.options.config.offset)  * 1000;
        this.showDuration = parseInt(this.props.options.config.show_duration) * 1000;
        this.periodicity = parseInt(this.props.options.config.periodicity) * 1000;

        this.isOffsetProcessed = (this.offset !== 0)
            ? false
            : true;

        this.state = {
            isShown: true
        }
    }

    periodic(showDuration, periodicity) {
        if (this.state.isShown === false) {
            setTimeout(() => {
                this.setState({ isShown: true });
            }, periodicity);
        }

        if (this.state.isShown === true) {
            setTimeout(() => {
                this.setState({ isShown: false });
            }, showDuration);
        }
    }

    cycle() {
        if (this.periodicity === 0) {
            return;
        }

        if (!this.isOffsetProcessed) {
            setTimeout(() => {
                this.isOffsetProcessed = true;
                this.setState({ isShown: true });
            }, this.offset);
            return;
        }

        this.periodic(this.showDuration, this.periodicity);
    }

    componentDidMount() {
        this.cycle();
    }

    componentDidUpdate() {
        this.cycle();
    }

    render() {
        return (
            <div style={{ display: this.state.isShown ? 'block' : 'none' }}>
                <WidgetMediatypeWrapper
                    options={ this.props.options }
                />
            </div>
        );
    }
}

WidgetPeriodicityWrapper.propTypes = {
    options: PropTypes.object.isRequired,
};
