import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {ConnectedRouter, routerMiddleware} from 'connected-react-router';
import {createBrowserHistory} from "history";
import createRootReducer from './redux/reducer/RootReducer';
import config from "./config/FirebaseConfig";
import firebase from "firebase/app";
import "firebase/auth";
import * as serviceWorker from './serviceWorker';
import {UserActions} from "./components/login/UserActions";
import {Constants} from "./helper/Constants";
import {getLocalStorage} from "./helper/WebHelper";


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
export const auth = firebaseApp.auth();
export const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    mailProvider: new firebase.auth.EmailAuthProvider(),
};
//----------------------------------------------------------------------------------------------------------------------

//verify if client logged in -------------------------------------------------------------------------------------------
if (getLocalStorage(Constants.USER) !== undefined && getLocalStorage(Constants.USER) !== null) {
    store.dispatch(UserActions.setLoggedUserAction(JSON.parse(getLocalStorage(Constants.USER) || '{}')));
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
