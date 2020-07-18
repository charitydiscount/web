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
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/performance';
import 'firebase/storage';
import 'firebase/remote-config';
import * as serviceWorker from './registerServiceWorker';
import { AuthActions } from './components/login/UserActions';
import I18nApp from './I18nApp';

export const publicUrl = process.env.PUBLIC_URL || '';
export const appVersion = '2.3.5';

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

// Initialize analytics
firebase.analytics();

remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000,
    fetchTimeoutMillis: 60000,
};
remoteConfig.fetchAndActivate();

//----------------------------------------------------------------------------------------------------------------------

//verify if user is logged in and authenticate him ---------------------------------------------------------------------
auth.onAuthStateChanged((user) => {
    if (user) {
        store.dispatch(AuthActions.setLoggedUserAction(user));
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

serviceWorker.register({
    onUpdate: (reg: ServiceWorkerRegistration) => {
        // Update the service worker content as soon as its available
        reg.unregister().then(() => {
            window.location.reload();
        });
    },
});
