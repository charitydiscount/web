import React, { useEffect, useState } from 'react';
import PageLayout from './components/layout/PageLayout';
import FooterLayout from './components/layout/FooterLayout';
import HeaderLayout from './components/layout/HeaderLayout';
import './static/scss/style.scss';
import CookieConsent from 'react-cookie-consent';
import { FormattedMessage } from 'react-intl';
import ScrollToTop from './components/layout/Scroll';
import ReactAdBlock from './ReactAdBlock';
import ReferralUpdate from './components/referrals/ReferralUpdate';
import { FadeLoader } from 'react-spinners';
import { spinnerCss } from './helper/AppHelper';

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    return loading ? (
        <FadeLoader loading={true} color={'#e31f29'} css={spinnerCss} />
    ) : (
        <React.Fragment>
            <ReactAdBlock />
            <ReferralUpdate />
            <ScrollToTop />
            <HeaderLayout />
            <PageLayout />
            <FooterLayout />
            <CookieConsent
                cookieName={'CookieCharityDiscount'}
                buttonText={
                    <FormattedMessage
                        id={'cookie.button'}
                        defaultMessage="I understand"
                    />
                }
                buttonStyle={{
                    color: '#fff',
                    fontSize: '14px',
                    background: '#e31f29',
                    borderRadius: '20px',
                }}
            >
                <FormattedMessage
                    id={'cookie.key'}
                    defaultMessage="This website uses cookies. By continuing you accept cookies usage"
                />
            </CookieConsent>
        </React.Fragment>
    );
};

export default App;
