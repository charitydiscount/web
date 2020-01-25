import * as React from 'react';
import PageLayout from './components/layout/PageLayout';
import FooterLayout from './components/layout/FooterLayout';
import HeaderLayout from './components/layout/HeaderLayout';
import './static/scss/style.scss';
import CookieConsent from 'react-cookie-consent';
import { FormattedMessage } from 'react-intl';
import { loadShops } from './redux/actions/ShopsAction';
import { connect } from 'react-redux';
import { AppState } from './redux/reducer/RootReducer';
import { FadeLoader } from 'react-spinners';
import { spinnerCss } from './helper/AppHelper';
import ScrollToTop from './components/layout/Scroll';
import ReactAdBlock from './ReactAdBlock';

interface StateProps {
    loaded: boolean;
}

interface DispatchProps {
    loadShops: Function;
}

class App extends React.Component<StateProps & DispatchProps> {
    componentDidMount() {
        this.props.loadShops();
    }

    render() {
        return this.props.loaded ? (
            <React.Fragment>
                <ReactAdBlock />
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
                        background: '#1641ff',
                        borderRadius: '20px',
                    }}
                >
                    <FormattedMessage
                        id={'cookie.key'}
                        defaultMessage="This website uses cookies. By continuing you accept cookies usage"
                    />
                </CookieConsent>
            </React.Fragment>
        ) : (
            <FadeLoader loading={true} color={'#1641ff'} css={spinnerCss} />
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        loaded: state.shops.shopsLoaded,
    };
};

export default connect(mapStateToProps, { loadShops })(App);
