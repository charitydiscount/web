import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import HeaderLayout from "./components/layout/HeaderLayout";
import HomeBanner from "./components/layout/HomeBanner";
import DownLayout from "./components/layout/DownLayout";
import Products from "./components/layout/Products";

ReactDOM.render(<HeaderLayout />,
    document.getElementById('headerLayout'));

ReactDOM.render(<HomeBanner />,
    document.getElementById('homeBanner'));

ReactDOM.render(<Products />,
    document.getElementById('products'));

ReactDOM.render(<DownLayout />,
    document.getElementById('downLayout'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
