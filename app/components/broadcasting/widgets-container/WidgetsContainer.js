// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ImageWidget  from 'components/broadcasting/widgets/ImageWidget';
import requestWidgetsPlan from 'actions/requestWidgetsPlan';

let widgets = {
    'ImageWidget': ImageWidget
}

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

        return this.props.widgets.map((widgetProps, index) => {
            let Component = widgets[widgetProps.component || 'ImageWidget'] || ImageWidget;
            let props = { ...widgetProps,
                ...{
                    url: this.props.serverUrl,
                    key: index
                }
            };

            return React.createElement(Component, props);
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        requestWidgetsPlan: bindActionCreators(requestWidgetsPlan, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsContainer);
