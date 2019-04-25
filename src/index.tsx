import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import HeaderLayout from "./components/layout/HeaderLayout";
import HomeBanner from "./components/layout/HomeBanner";
import HotDeals from "./components/layout/HotDeals";
import ClientsLogo from "./components/layout/ClientsLogo";

ReactDOM.render(<HeaderLayout />,
    document.getElementById('headerLayout'));

ReactDOM.render(<HomeBanner />,
    document.getElementById('homeBanner'));

ReactDOM.render(<HotDeals />,
    document.getElementById('hotDeals'));

ReactDOM.render(<ClientsLogo />,
    document.getElementById('clientsLogo'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
