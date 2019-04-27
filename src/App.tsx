import * as React from 'react';

import PageLayout from "./components/layout/PageLayout";
import DownLayout from "./components/layout/DownLayout";
import HeaderLayout from "./components/layout/HeaderLayout";

class App extends React.Component {

    public render() {
        return (
            <React.Fragment>
                <HeaderLayout/>
                <section className="banner_area">
                </section>
                <PageLayout/>
                <DownLayout/>
            </React.Fragment>
        );
    }
}

export default App;
