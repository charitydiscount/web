import * as React from 'react';

import PageLayout from './components/layout/PageLayout';
import FooterLayout from './components/layout/FooterLayout';
import HeaderLayout from './components/layout/HeaderLayout';
import './static/scss/style.scss';

class App extends React.Component {
    public render() {
        return (
            <React.Fragment>
                <HeaderLayout />
                <PageLayout />
                <FooterLayout />
            </React.Fragment>
        );
    }
}

export default App;
