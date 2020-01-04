import * as React from 'react';

import PageLayout from './components/layout/PageLayout';
import FooterLayout from './components/layout/FooterLayout';
import HeaderLayout from './components/layout/HeaderLayout';
import './static/scss/style.scss';
import CookieConsent from "react-cookie-consent";
import {FormattedMessage} from 'react-intl';

class App extends React.Component {

    public render() {
        return (
            <React.Fragment>
                <HeaderLayout/>
                <PageLayout/>
                <FooterLayout/>
                <CookieConsent
                    buttonText={
                        <FormattedMessage id={"cookie.button"}
                                          defaultMessage="I understand"/>
                    }
                    buttonStyle={{
                        color: "#fff",
                        fontSize: "14px",
                        background: "#1641ff",
                        borderRadius: "20px"
                    }}
                >
                    <FormattedMessage id={"cookie.key"}
                                      defaultMessage="This website uses cookies. By continuing you accept cookies usage"/>
                </CookieConsent>
            </React.Fragment>
        );
    }
}

export default App;
