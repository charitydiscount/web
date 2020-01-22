import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {Routes} from '../helper/Routes';
import Contact from '../contact/Contact';
import Shops from '../shops/Shops';
import LoginActor from '../login/LoginActor';
import UserInfo from '../login/UserInfo';
import Causes from '../causes/Causes';
import {getLocalStorage} from "../../helper/StorageHelper";
import {StorageKey} from "../../helper/Constants";
import Wallet from "../wallet/Wallet";
import Tos from "../tos/Tos";
import Privacy from "../privacy/Privacy";
import ShopReview from "../shops/ShopReview";
import Products from "../products/Products";
import ExternalAccess from "../external/ExternalAccess";
import Faq from "../faq/Faq";

const PageLayout = () => {
    if (getLocalStorage(StorageKey.USER)) {
        return (
            <main>
                <Switch>
                    <Route exact={true} path={Routes.CONTACT} component={Contact}/>
                    <Route exact={true} path={Routes.CATEGORIES + '/:favShops'} component={Shops}/>
                    <Route exact={true} path={Routes.CATEGORIES} component={Shops}/>
                    <Route exact={true} path={Routes.CATEGORIES + '/shop/:shopName'} component={Shops}/>
                    <Route exact={true} path={Routes.USER} component={UserInfo}/>
                    <Route exact={true} path={Routes.CAUSES} component={Causes}/>
                    <Route exact={true} path={Routes.LOGIN} component={LoginActor}/>
                    <Route exact={true} path={Routes.WALLET} component={Wallet}/>
                    <Route exact={true} path={Routes.WALLET + "/donate/:caseId"} component={Wallet}/>
                    <Route exact={true} path={Routes.REVIEW + "/:id"} component={ShopReview}/>
                    <Route exact={true} path={Routes.TOS} component={Tos}/>
                    <Route exact={true} path={Routes.PRIVACY} component={Privacy}/>
                    <Route exact={true} path={Routes.FAQ} component={Faq}/>
                    <Route exact={true} path={Routes.PRODUCTS} component={Products}/>
                    <Route exact={true} path={Routes.AUTH} component={ExternalAccess}/>
                    <Route render={() => <Redirect to={Routes.LOGIN}/>}/>
                </Switch>
            </main>
        );
    } else {
        return (
            <main>
                <Switch>
                    <Route exact={true} path={Routes.LOGIN} component={LoginActor}/>
                    <Route exact={true} path={Routes.TOS} component={Tos}/>
                    <Route exact={true} path={Routes.PRIVACY} component={Privacy}/>
                    <Route exact={true} path={Routes.FAQ} component={Faq}/>
                    <Route exact={true} path={Routes.AUTH} component={ExternalAccess}/>
                    <Route render={() => <Redirect to={Routes.LOGIN}/>}/>
                </Switch>
            </main>
        );
    }
};
export default PageLayout;
