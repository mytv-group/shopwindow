// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import WidgetWrapper  from 'components/broadcasting/widget-wrapper/WidgetWrapper';

class WidgetMediatypeWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: true
        }
    }

    checkVisible() {
        if (this.props.onAir.type !== this.props.prevCast.type) {
            if (this.state.isVisible !== (this.props.onAir.type !== 'adv')) {
                this.setState({ isVisible: (this.props.onAir.type !== 'adv') });
            }
        }
    }

    componentDidMount() {
        if (this.state.isVisible && (this.props.onAir.type === 'adv')) {
            this.setState({ isVisible: false });
        }
    }

    componentDidUpdate() {
        this.checkVisible();
    }

    render() {
        return (
            <div style={{ visibility: this.state.isVisible ? 'visible' : 'hidden' }}>
                <WidgetWrapper
                    options={ this.props.options }
                />
            </div>
        );
    }
}

WidgetMediatypeWrapper.propTypes = {
    options: PropTypes.object.isRequired,
    onAir: PropTypes.object.isRequired,
    prevCast: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        onAir: state.onAir.now,
        prevCast: state.onAir.prev
    };
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetMediatypeWrapper);
