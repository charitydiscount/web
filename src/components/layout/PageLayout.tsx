import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Routes } from '../helper/Routes';
import Contact from '../pages/contact/Contact';
import Shops from '../pages/shops/Shops';
import LoginActor from '../pages/login/LoginActor';
import UserInfo from '../pages/login/UserInfo';
import Causes from '../pages/causes/Causes';
import Wallet from '../pages/wallet/Wallet';
import Tos from '../pages/tos/Tos';
import Privacy from '../pages/privacy/Privacy';
import ShopReview from '../pages/shops/ShopInfo';
import Products from '../pages/products/Products';
import ExternalAccess from '../external/ExternalAccess';
import Faq from '../pages/faq/Faq';
import { AppState } from '../../redux/reducer/RootReducer';
import { connect } from 'react-redux';
import Referrals from '../pages/referrals/Referrals';
import ReferralLogin from '../pages/referrals/ReferralLogin';
import { loadShops } from '../../redux/actions/ShopsAction';
import UnsubscribeFromMailNewsletter from '../pages/login/UnsubscribeFromMailNewsletter';
import ExternalShop from "../pages/shops/ExternalShop";
import { FadeLoader } from "react-spinners";
import { spinnerCss } from "../../helper/AppHelper";
import Promotions from "../pages/promotions/Promotions";
import { clearStorage } from "../../helper/StorageHelper";
import Achievements from "../pages/achievements/Achievements";
import Leaderboard from "../pages/leaderboard/Leaderboard";
import ProductInfo from "../pages/products/ProductInfo";

interface PageLayoutProps {
    isLoggedIn: boolean;
    shopsLoaded: boolean;
    loadShops: Function;
}

const PageLayout = (props: PageLayoutProps) => {

    useEffect(() => {
        if (!props.shopsLoaded) {
            clearStorage();
            props.loadShops();
        }
    });

    if (props.shopsLoaded) {
        if (props.isLoggedIn) {
            return (
                <main>
                    <Switch>
                        <Route
                            exact={true}
                            path={Routes.CONTACT}
                            component={Contact}
                        />
                        <Route
                            exact={true}
                            path={Routes.SHOPS + '/:favShops'}
                            component={Shops}
                        />
                        <Route
                            exact={true}
                            path={Routes.PRODUCT_INFO}
                            component={ProductInfo}
                        />
                        <Route
                            exact={true}
                            path={Routes.SHOPS}
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
                            path={Routes.PROMOTIONS}
                            component={Promotions}
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
                            path={Routes.UNSUBSCRIBE_MAIL_NEWSLETTER + '/:userId'}
                            component={UnsubscribeFromMailNewsletter}
                        />
                        <Route
                            exact={true}
                            path={Routes.SHOP_INFO + '/:id'}
                            component={ShopReview}
                        />
                        <Route
                            exact={true}
                            path={Routes.TOS}
                            component={Tos}
                        />
                        <Route
                            exact={true}
                            path={Routes.PRIVACY}
                            component={Privacy}
                        />
                        <Route
                            exact={true}
                            path={Routes.FAQ}
                            component={Faq}
                        />
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
                        <Route
                            exact={true}
                            path={Routes.ACHIEVEMENTS}
                            component={Achievements}
                        />
                        <Route
                            exact={true}
                            path={Routes.LEADERBOARD}
                            component={Leaderboard}
                        />
                        <Route render={() => <Redirect to={Routes.SHOPS}/>}/>
                    </Switch>
                </main>
            )
        } else {
            return (
                <main>
                    <Switch>
                        <Route
                            exact={true}
                            path={Routes.SHOPS}
                            component={Shops}
                        />
                        <Route
                            exact={true}
                            path={Routes.SHOP + '/:shopName'}
                            component={ExternalShop}
                        />
                        <Route
                            exact={true}
                            path={Routes.REFFERRAL_LOGIN + '/:key'}
                            component={ReferralLogin}
                        />
                        <Route
                            exact={true}
                            path={Routes.CAUSES}
                            component={Causes}
                        />
                        <Route
                            exact={true}
                            path={Routes.UNSUBSCRIBE_MAIL_NEWSLETTER + '/:userId'}
                            component={UnsubscribeFromMailNewsletter}
                        />
                        <Route
                            exact={true}
                            path={Routes.LOGIN}
                            component={LoginActor}
                        />
                        <Route
                            exact={true}
                            path={Routes.TOS}
                            component={Tos}
                        />
                        <Route
                            exact={true}
                            path={Routes.PRIVACY}
                            component={Privacy}
                        />
                        <Route
                            exact={true}
                            path={Routes.FAQ}
                            component={Faq}
                        />
                        <Route
                            exact={true}
                            path={Routes.AUTH}
                            component={ExternalAccess}
                        />
                        <Route render={() => <Redirect to={Routes.SHOPS}/>}/>
                    </Switch>
                </main>
            );
        }
    } else {
        return <FadeLoader loading={true} color={'#e31f29'} css={spinnerCss}/>
    }
};

const mapStateToProps = (state: AppState) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        shopsLoaded: state.shops.shopsLoaded
    };
};

export default connect(mapStateToProps, {loadShops})(PageLayout);
