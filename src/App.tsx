import * as React from 'react';

import PageLayout from "./components/layout/PageLayout";
import HomeBanner from "./components/layout/HomeBanner";
import DownLayout from "./components/layout/DownLayout";
import HeaderLayout from "./components/layout/HeaderLayout";


class App extends React.Component {

    // public componentDidUpdate() {
    //     checkIfSameHtmlId();
    // }

    public render() {
        return (
            <React.Fragment>
                <HeaderLayout/>
                <HomeBanner/>
                <PageLayout/>
                <DownLayout/>
            </React.Fragment>
        );
    }
}

export default App;
