import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {ConnectedRouter, push, routerMiddleware} from 'connected-react-router';
import {createBrowserHistory} from "history";
import createRootReducer from './redux/reducer/RootReducer';
import config from "./config/FirebaseConfig";
import firebase from "firebase";
import "firebase/auth"; // for DB auth
import 'firebase/firestore'; //for DB connection
import * as serviceWorker from './serviceWorker';
import {doLogoutAction, UserActions} from "./components/login/UserActions";
import {getLocalStorage} from "./helper/WebHelper";
import {StorageKey} from "./helper/Constants";
import {Routes} from "./components/helper/Routes";


export const publicUrl = process.env.PUBLIC_URL || "";

// REDUX----------------------------------------------------------------------------------------------------------------
const initialState = {};
export const history = createBrowserHistory({basename: publicUrl});
// redux store
export const store = createStore(createRootReducer(history), initialState,
    applyMiddleware(
        thunk,
        routerMiddleware(history),
    )
);
//----------------------------------------------------------------------------------------------------------------------

// Firebase connection--------------------------------------------------------------------------------------------------
export const firebaseApp = firebase.initializeApp(config);
export const DB = firebaseApp.firestore();
export const auth = firebaseApp.auth();

//----------------------------------------------------------------------------------------------------------------------

//verify if client logged in -------------------------------------------------------------------------------------------
const user = getLocalStorage(StorageKey.USER);
if (user) {
    store.dispatch(UserActions.setLoggedUserAction(JSON.parse(user) as firebase.User));
}else{
    doLogoutAction();
}

//----------------------------------------------------------------------------------------------------------------------
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'));

serviceWorker.register();
