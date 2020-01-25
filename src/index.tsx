import React from 'react';
import ReactDOM from 'react-dom';
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
import 'firebase/performance';
import 'firebase/storage';
import 'firebase/remote-config';
import * as serviceWorker from './registerServiceWorker';
import { AuthActions } from './components/login/UserActions';
import I18nApp from './I18nApp';

export const publicUrl = process.env.PUBLIC_URL || '';
export const appVersion = '2.1.1';

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
export const storage = firebaseApp.storage();
export const remoteConfig = firebaseApp.remoteConfig();
remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000,
    fetchTimeoutMillis: 60000,
};
remoteConfig.fetchAndActivate();

//----------------------------------------------------------------------------------------------------------------------

//verify if client logged in -------------------------------------------------------------------------------------------
auth.onAuthStateChanged(user => {
    if (user) {
        store.dispatch(AuthActions.setLoggedUserAction(user.uid));
    }
});

//----------------------------------------------------------------------------------------------------------------------
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <I18nApp />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
