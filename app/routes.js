/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import BroadcastingPage from './containers/BroadcastingPage';
import SettingsPage from './containers/SettingsPage';
import ConfigurePage from './containers/ConfigurePage';

export default () => (
    <App>
        <Switch>
            <Route path='/broadcasting' component={ BroadcastingPage } />
            <Route path='/settings' component={ SettingsPage } />
            <Route path='/' component={ ConfigurePage } />
        </Switch>
    </App>
);
