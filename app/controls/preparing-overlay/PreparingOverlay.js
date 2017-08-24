// @flow
import styles from './preparing-overlay.scss';

import React, { Component } from 'react';

import ProgressDots from 'controls/progress-dots/ProgressDots';

export default function PreparingOverlay (props) {
    return (
        <div className={ styles.preparingOverlay }>
            <div className={ styles.topSign + ' is-size-3' }>
                We will be on the air in a moment!
            </div>
            <div className={ styles.logo }></div>
            <div className={ styles.bottomSign + ' is-size-3' }>
                { props.task || 'Preparing application' }
                <ProgressDots/>
            </div>
        </div>
    );
}
