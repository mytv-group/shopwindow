// @flow
import styles from './invalid-overlay.scss';

import React, { Component } from 'react';

export default function InvalidOverlay (props) {
    return (
        <div className={ styles.invalidOverlay }>
            <div className={ styles.topSign + ' is-size-3' }>
                { props.reason }
            </div>
            <div className={ styles.logo }></div>
        </div>
    );
}
