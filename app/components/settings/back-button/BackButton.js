// @flow
import styles from './back-button.scss';

import React from 'react';
import { Link } from 'react-router-dom';

export default function BackButton () {
    return (
        <div>
            <div className={ styles.backButton } data-tid="backButton">
                <Link to="/">
                    <i className="fa fa-arrow-left fa-3x" />
                </Link>
            </div>
        </div>
    );
}
