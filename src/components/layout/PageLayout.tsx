import * as React from "react";
import {Redirect, Route, Switch} from "react-router";
import {Routes} from "../helper/Routes";
import Contact from "../contact/Contact";
import Categories from "../products/Categories";
import LoginActor from "../login/LoginActor";
import RegisterActor from "../login/RegisterActor";
import UserInfo from "../login/UserInfo";
import HotDeals from "../deals/HotDeals";
import Causes from "../causes/Causes";

const PageLayout = () => {
    return (
        <main>
                <Switch>
                    <Route exact={true} path={Routes.LOGIN} component={LoginActor}/>
                    <Route exact={true} path={Routes.REGISTER} component={RegisterActor}/>
                    <Route exact={true} path={Routes.CONTACT} component={Contact}/>
                    <Route exact={true} path={Routes.CATEGORIES} component={Categories}/>
                    <Route exact={true} path={Routes.DEALS} component={HotDeals}/>
                    <Route exact={true} path={Routes.USER} component={UserInfo}/>
                    <Route exact={true} path={Routes.CAUSES} component={Causes}/>
                    <Route render={() => <Redirect to={Routes.LOGIN}/>}/>
                </Switch>
        </main>
    )
};
export default PageLayout;