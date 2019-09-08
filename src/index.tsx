import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {ConnectedRouter, routerMiddleware} from 'connected-react-router';
import {createBrowserHistory} from 'history';
import createRootReducer from './redux/reducer/RootReducer';
import config from './config/FirebaseConfig';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as serviceWorker from './serviceWorker';
import {UserActions} from './components/login/UserActions';
import {getLocalStorage} from './helper/StorageHelper';
import {StorageKey} from './helper/Constants';

export const publicUrl = process.env.PUBLIC_URL || '';

// REDUX----------------------------------------------------------------------------------------------------------------
const initialState = {};
export const history = createBrowserHistory({basename: publicUrl});
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
const user = getLocalStorage(StorageKey.USER);
if (user && user.length > 0) {
    //validate json present in storage
    if (user.includes("uid") && user.includes("displayName") && user.includes("email")) {
        store.dispatch(UserActions.setLoggedUserAction(user));
    }
}

//----------------------------------------------------------------------------------------------------------------------
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();
