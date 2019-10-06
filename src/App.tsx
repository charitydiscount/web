import * as React from 'react';

import PageLayout from "./components/layout/PageLayout";
import FooterLayout from "./components/layout/FooterLayout";
import HeaderLayout from "./components/layout/HeaderLayout";

class App extends React.Component {

    public render() {
        return (
            <React.Fragment>
                <HeaderLayout/>
                <div className="banner_area"/>
                <PageLayout/>
                <FooterLayout/>
            </React.Fragment>
        );
    }
}

export default App;
