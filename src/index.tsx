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
import { UserActions } from './components/login/UserActions';
import { getLocalStorage } from './helper/StorageHelper';
import { StorageKey } from './helper/Constants';
import { updateUser } from './rest/UserService';
import { LoginDto } from './components/login/LoginComponent';
import I18nApp from './I18nApp';

export const publicUrl = process.env.PUBLIC_URL || '';
export const appVersion = '1.9.7';

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
const user = getLocalStorage(StorageKey.USER);
if (user && user.length > 0) {
    //validate json present in storage
    if (user.includes('uid') && user.includes('email')) {
        var parsedUser = JSON.parse(user) as LoginDto;
        var userCD = new Date(parsedUser.creationTime);
        userCD.setMinutes(userCD.getMinutes() + 1);
        //created in the last minute, add it to DB
        if (userCD > new Date()) {
            updateUser(
                {
                    accounts: [],
                    email: parsedUser.email,
                    name: parsedUser.displayName,
                    photoUrl: parsedUser.photoURL ? parsedUser.photoURL : '',
                    userId: parsedUser.uid,
                },
                user
            );
        } else {
            store.dispatch(UserActions.setLoggedUserAction(user));
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

