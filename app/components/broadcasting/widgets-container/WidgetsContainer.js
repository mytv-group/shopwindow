// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import WidgetWrapper from 'components/broadcasting/widget-wrapper/WidgetWrapper';

import requestWidgetsPlan from 'actions/requestWidgetsPlan';

class WidgetsContainer extends Component {
    componentDidMount() {
        if (this.props.pending === null) {
            this.props.requestWidgetsPlan({
                url: this.props.serverUrl,
                id: this.props.pointId
            });
        }
    }

    build() {
        if (this.props.widgets.length === 0) {
            return '';
        }

        return this.props.widgets.map((options, index) => {
            return <WidgetWrapper
                key={ index }
                url={ this.props.serverUrl }
                options={ options }
            />;
        });
    }

    render() {
        return (
            <div>
                { this.build() }
            </div>
        );
    }
}

WidgetsContainer.propTypes = {
    pending: PropTypes.oneOf([null, true, false]),
    widgets: PropTypes.array.isRequired,
    serverUrl: PropTypes.string.isRequired,
    pointId: PropTypes.number.isRequired,
    requestWidgetsPlan: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        pending: state.widgets.pending,
        widgets: state.widgets.items,
        serverUrl: state.settings.serverUrl,
        pointId: state.settings.pointId,
        onAir: state.onAir.now
    };
}

function mapDispatchToProps(dispatch) {
    return {
        requestWidgetsPlan: bindActionCreators(requestWidgetsPlan, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsContainer);
