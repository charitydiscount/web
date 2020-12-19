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
import { AuthActions } from './redux/actions/UserActions';
import I18nApp from './I18nApp';
import { getLocalStorage } from './helper/StorageHelper';
import { StorageKey } from './helper/Constants';
import { UserInfoDto } from './components/login/AuthHelper';

export const publicUrl = process.env.PUBLIC_URL || '';
export const appVersion = '2.6.4';

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

//verify if client logged in -------------------------------------------------------------------------------------------
const user = getLocalStorage(StorageKey.USER);
if (user && user.length > 0) {
    //validate json present in storage
    if (user.includes('uid')) {
        let parsedUser;
        try {
            parsedUser = JSON.parse(user) as UserInfoDto;
            store.dispatch(AuthActions.setLoggedUserAction(parsedUser));
        } catch (e) {
            store.dispatch(AuthActions.resetLoggedUserAction());
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <I18nApp />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

//force unregister of old service workers
navigator.serviceWorker.getRegistrations().then( function(registrations) { for(let registration of registrations) { registration.unregister(); } });