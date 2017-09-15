// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ImageWidget  from 'components/broadcasting/widgets/ImageWidget';

let widgets = {
    'ImageWidget': ImageWidget
}

class WidgetWrapper extends Component {
    build() {
        if (this.props.onAir && (this.props.onAir.type === 'adv')) {
            return '';
        }

        let Component = widgets[this.props.options.component || 'ImageWidget'] || ImageWidget;
        let props = { ...this.props.options,
            ...{
                url: this.props.url,
            }
        };

        return React.createElement(Component, props);
    }

    render() {
        console.log(this.props.onAir);
        return (
            <div>
                { this.build() }
            </div>
        );
    }
}

WidgetWrapper.propTypes = {
    url: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    onAir: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        onAir: state.onAir.now
    };
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetWrapper);
