// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';

const history = createHashHistory();

function configureStore(initialState) {
  const router = routerMiddleware(history);

  return createStore(
      rootReducer,
      initialState,
      applyMiddleware(thunk, router)
  );
}

export default { configureStore, history };
