// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import settings from './settings';
import schedule from './schedule';
import media from './media';
import widgets from './widgets';
import onAir from './onAir';

const rootReducer = combineReducers({
    router,
    settings,
    schedule,
    media,
    widgets,
    onAir
});

export default rootReducer;
