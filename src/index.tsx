import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import createRootReducer from './redux/reducer/RootReducer';
import config from './config/FirebaseConfig';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as serviceWorker from './serviceWorker';
import { UserActions } from './components/login/UserActions';
import { getLocalStorage } from './helper/StorageHelper';
import { StorageKey } from './helper/Constants';

export const publicUrl = process.env.PUBLIC_URL || '';

// REDUX----------------------------------------------------------------------------------------------------------------
const initialState = {};
export const history = createBrowserHistory({ basename: publicUrl });
// redux store
export const store = createStore(
  createRootReducer(history),
  initialState,
  applyMiddleware(thunk, routerMiddleware(history))
);
//----------------------------------------------------------------------------------------------------------------------

// Firebase connection--------------------------------------------------------------------------------------------------
export const firebaseApp = firebase.initializeApp(config);
export const DB = firebaseApp.firestore();
export const auth = firebaseApp.auth();

//----------------------------------------------------------------------------------------------------------------------

//verify if client logged in -------------------------------------------------------------------------------------------
const userKey = getLocalStorage(StorageKey.USER);
if (userKey) {
  store.dispatch(UserActions.setLoggedUserAction(userKey));
}

//----------------------------------------------------------------------------------------------------------------------
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.register();
