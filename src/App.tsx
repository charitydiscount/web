import * as React from 'react';

import PageLayout from "./components/layout/PageLayout";
import FooterLayou from "./components/layout/FooterLayou";
import HeaderLayout from "./components/layout/HeaderLayout";

class App extends React.Component {

    public render() {
        return (
            <React.Fragment>
                <HeaderLayout/>
                <div className="banner_area"/>
                <PageLayout/>
                <FooterLayou/>
            </React.Fragment>
        );
    }
}

export default App;
