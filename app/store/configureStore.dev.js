import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const history = createHashHistory();

const configureStore = (initialState) => {
  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Router Middleware
  const router = routerMiddleware(history);

  // Create Store
  const store = createStore(
      rootReducer,
      initialState,
      composeWithDevTools(
          applyMiddleware(thunk, logger, router)
      )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  return store;
};

export default { configureStore, history };
