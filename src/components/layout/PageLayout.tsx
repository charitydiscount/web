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
import { loadShops } from '../../redux/actions/ShopsAction';
import UnsubscribeFromMailNewsletter from '../login/UnsubscribeFromMailNewsletter';
import ExternalShop from "../shops/ExternalShop";
import { FadeLoader } from "react-spinners";
import { spinnerCss } from "../../helper/AppHelper";
import Promotions from "../promotions/Promotions";
import { clearStorage } from "../../helper/StorageHelper";
import { loadUserData } from "../../redux/actions/UserActions";
import Achievements from "../achievements/Achievements";
import Leaderboard from "../leaderboard/Leaderboard";

interface PageLayoutProps {
    isLoggedIn: boolean;
    shopsLoaded: boolean;
    loadUserData: Function;
    loadShops: Function;
}

const PageLayout = (props: PageLayoutProps) => {

    useEffect(() => {
        if (!props.shopsLoaded) {
            clearStorage();
            props.loadShops();
        }
    });

    useEffect(() => {
        if (props.isLoggedIn) {
            props.loadUserData();
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
                            path={Routes.REVIEW + '/:id'}
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

export default connect(mapStateToProps, {loadShops, loadUserData})(PageLayout);
