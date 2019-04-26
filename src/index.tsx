import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {routerMiddleware} from 'connected-react-router';
import {createBrowserHistory} from "history";
import createRootReducer from './redux/reducer/RootReducer';

export const publicUrl = process.env.PUBLIC_URL || "";
const initialState = {};
export const history = createBrowserHistory({basename: publicUrl});
// redux store
export const store = createStore(createRootReducer(history), initialState,
    applyMiddleware(
        thunk,
        routerMiddleware(history),
    )
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));


