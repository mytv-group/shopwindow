import React, { Component } from 'react';
import BackButton from '../components/settings/back-button/BackButton';
import Settings from '../components/settings/Settings';

export default function SettingsPage () {
    return (
        <div>
            <BackButton/>
            <Settings/>
        </div>
    );
}
