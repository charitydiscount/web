import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {Routes} from '../helper/Routes';
import Contact from '../contact/Contact';
import Shops from '../products/Shops';
import LoginActor from '../login/LoginActor';
import UserInfo from '../login/UserInfo';
import HotDeals from '../deals/HotDeals';
import Causes from '../causes/Causes';
import {getLocalStorage} from "../../helper/WebHelper";
import {StorageKey} from "../../helper/Constants";

const PageLayout = () => {
    const userKeyExists = getLocalStorage(StorageKey.USER);
    if (userKeyExists) {
        return (
            <main>
                <Switch>
                    <Route exact={true} path={Routes.CONTACT} component={Contact}/>
                    <Route exact={true} path={Routes.CATEGORIES} component={Shops}/>
                    <Route exact={true} path={Routes.DEALS} component={HotDeals}/>
                    <Route exact={true} path={Routes.USER} component={UserInfo}/>
                    <Route exact={true} path={Routes.CAUSES} component={Causes}/>
                    <Route exact={true} path={Routes.LOGIN} component={LoginActor}/>
                    <Route render={() => <Redirect to={Routes.LOGIN}/>}/>
                </Switch>
            </main>
        );
    } else {
        return (
            <main>
                <Switch>
                    <Route exact={true} path={Routes.LOGIN} component={LoginActor}/>
                    <Route render={() => <Redirect to={Routes.LOGIN}/>}/>
                </Switch>
            </main>
        );
    }
};
export default PageLayout;
