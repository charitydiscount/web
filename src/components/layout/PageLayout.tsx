import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Routes } from '../helper/Routes';
import Contact from '../contact/Contact';
import Shops from '../shops/Shops';
import LoginActor from '../login/LoginActor';
import UserInfo from '../login/UserInfo';
import Causes from '../causes/Causes';
import Wallet from '../wallet/Wallet';
import Tos from '../tos/Tos';
import Privacy from '../privacy/Privacy';
import ShopReview from '../shops/ShopReview';
import Products from '../products/Products';
import ExternalAccess from '../external/ExternalAccess';
import Faq from '../faq/Faq';
import { AppState } from '../../redux/reducer/RootReducer';
import { connect } from 'react-redux';
import Referrals from '../referrals/Referrals';
import ReferralLogin from '../referrals/ReferralLogin';
import { FadeLoader } from 'react-spinners';
import { spinnerCss } from '../../helper/AppHelper';
import { loadShops } from '../../redux/actions/ShopsAction';
import ExternalShop from "../shops/ExternalShop";
import UnsubscribeMailRedirect from "../login/UnsubscribeMailRedirect";

interface PageLayoutProps {
    isLoggedIn: boolean;
    shopsLoaded: boolean;
    loadShops: Function;
}

const PageLayout = (props: PageLayoutProps) => {
    useEffect(() => {
        if (props.isLoggedIn && !props.shopsLoaded) {
            props.loadShops();
        }
    });

    if (props.isLoggedIn) {
        return props.shopsLoaded ? (
            <main>
                <Switch>
                    <Route
                        exact={true}
                        path={Routes.CONTACT}
                        component={Contact}
                    />
                    <Route
                        exact={true}
                        path={Routes.CATEGORIES + '/:favShops'}
                        component={Shops}
                    />
                    <Route
                        exact={true}
                        path={Routes.CATEGORIES}
                        component={Shops}
                    />
                    <Route
                        exact={true}
                        path={Routes.SHOP + '/:shopName'}
                        component={Shops}
                    />
                    <Route
                        exact={true}
                        path={Routes.USER}
                        component={UserInfo}
                    />
                    <Route
                        exact={true}
                        path={Routes.CAUSES}
                        component={Causes}
                    />
                    <Route
                        exact={true}
                        path={Routes.LOGIN}
                        component={LoginActor}
                    />
                    <Route
                        exact={true}
                        path={Routes.WALLET}
                        component={Wallet}
                    />
                    <Route
                        exact={true}
                        path={Routes.WALLET + '/donate/:caseId'}
                        component={Wallet}
                    />
                    <Route
                        exact={true}
                        path={Routes.REFERRALS}
                        component={Referrals}
                    />
                    <Route
                        exact={true}
                        path={Routes.USER + '/unsubscribe'}
                        component={UserInfo}
                    />
                    <Route
                        exact={true}
                        path={Routes.REVIEW + '/:id'}
                        component={ShopReview}
                    />
                    <Route exact={true} path={Routes.TOS} component={Tos} />
                    <Route
                        exact={true}
                        path={Routes.PRIVACY}
                        component={Privacy}
                    />
                    <Route exact={true} path={Routes.FAQ} component={Faq} />
                    <Route
                        exact={true}
                        path={Routes.PRODUCTS}
                        component={Products}
                    />
                    <Route
                        exact={true}
                        path={Routes.AUTH}
                        component={ExternalAccess}
                    />
                    <Route render={() => <Redirect to={Routes.LOGIN} />} />
                </Switch>
            </main>
        ) : (
            <FadeLoader loading={true} color={'#1641ff'} css={spinnerCss} />
        );
    } else {
        return (
            <main>
                <Switch>
                    <Route
                        exact={true}
                        path={Routes.REFFERRAL_LOGIN + '/:key'}
                        component={ReferralLogin}
                    />
                    <Route
                        exact={true}
                        path={Routes.SHOP + '/:shopName'}
                        component={ExternalShop}
                    />
                    <Route
                        exact={true}
                        path={Routes.USER + '/unsubscribe'}
                        component={UnsubscribeMailRedirect}
                    />
                    <Route
                        exact={true}
                        path={Routes.LOGIN}
                        component={LoginActor}
                    />
                    <Route exact={true} path={Routes.TOS} component={Tos} />
                    <Route
                        exact={true}
                        path={Routes.PRIVACY}
                        component={Privacy}
                    />
                    <Route exact={true} path={Routes.FAQ} component={Faq} />
                    <Route
                        exact={true}
                        path={Routes.AUTH}
                        component={ExternalAccess}
                    />
                    <Route render={() => <Redirect to={Routes.LOGIN} />} />
                </Switch>
            </main>
        );
    }
};

const mapStateToProps = (state: AppState) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        shopsLoaded: state.shops.shopsLoaded,
    };
};

export default connect(mapStateToProps, { loadShops })(PageLayout);
