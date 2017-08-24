// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import settings from './settings';
import schedule from './schedule';
import media from './media';

const rootReducer = combineReducers({
    router,
    settings,
    schedule,
    media
});

export default rootReducer;
