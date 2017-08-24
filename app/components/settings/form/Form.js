// @flow
import styles from './form.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import saveStore from 'actions/saveStore'

const fields = [
    {
        key: 'pointId',
        value: '',
        label: 'Point ID',
        placeholder: ''
    },
    {
        key: 'serverUrl',
        value: '',
        label: 'Server URL',
        placeholder: ''
    },
    {
        key: 'authToken',
        value: '',
        label: 'Auth token',
        placeholder: ''
    },
    {
        key: 'notificationEmail',
        value: '',
        label: 'Notification Email',
        placeholder: ''
    },
]

class Form extends Component {
    constructor(props) {
        super(props);

        this.fileds = fields.map((item) => {
            if (props[item.key] && props[item.key] !== null) {
                return { ...item, ...{ value: props[item.key] } };
            }

            return item;
        });

        this.fileds.forEach((item) => {
            this.state = {
                ...this.state, ...{
                    [item.key]: item.value
                }
            }
        });
    }

    handleChange(key, event) {
        this.setState({ [key]: event.target.value.trim() });
    }

    handleClear() {
        let state = this.state;
        this.fileds.forEach((item) => {
            state = {
                ...state, ...{
                    [item.key]: ''
                }
            };
        });

        this.setState(state);
    }

    handleSubmit() {
        let settings = {};

        this.fileds.forEach((item) => {
            settings = {
                ...settings, ...{
                    [item.key]: this.state[item.key]
                }
            };
        });

        this.props.saveStore('settings', settings);
    }

    buildFields() {
        return this.fileds.map((item) => {
            return <div className='field' key={ item.key } >
                  <label className='label'>{ item.label }</label>
                  <div className='control'>
                    <input
                        className='input'
                        type='text'
                        placeholder={ item.placeholder }
                        value={ this.state[item.key] }
                        onChange={ this.handleChange.bind(this, item.key) }
                    />
                  </div>
                </div>;
        });
    }

    render() {
        return (
            <form className={ styles.form } onSubmit={ this.handleSubmit.bind(this) }>
                { this.buildFields() }
                <div className='field is-grouped'>
                    <div className='control'>
                        <button className='button is-primary' type='submit'>
                            Save
                        </button>
                    </div>
                    <div className='control'>
                        <button className='button is-link'
                             type='button'
                             onClick={ this.handleClear.bind(this) }
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

Form.propTypes = {
    pointId: PropTypes.number,
    serverUrl: PropTypes.string,
    authToken: PropTypes.string,
    notificationEmail: PropTypes.string
};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        saveStore: bindActionCreators(saveStore, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
