// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ImageWidget  from 'components/broadcasting/widgets/ImageWidget';

let widgets = {
    'ImageWidget': ImageWidget
}

export default class WidgetWrapper extends Component {
    render() {
        let Component = widgets[this.props.options.component || 'ImageWidget'] || ImageWidget;

        return React.createElement(Component, this.props.options);
    }
}

WidgetWrapper.propTypes = {
    options: PropTypes.object.isRequired,
};
