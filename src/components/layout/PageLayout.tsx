import * as React from "react";
import {Redirect, Route, Switch} from "react-router";
import {Routes} from "../helper/Routes";
import Contact from "../contact/Contact";
import Categories from "../products/Categories";
import ProductInfo from "../products/ProductInfo";
import LoginActor from "../login/LoginActor";
import RegisterActor from "../login/RegisterActor";
import UserInfo from "../login/UserInfo";

const PageLayout = () => {
    return (
        <main>
                <Switch>
                    <Route exact={true} path={Routes.LOGIN} component={LoginActor}/>
                    <Route exact={true} path={Routes.REGISTER} component={RegisterActor}/>
                    <Route exact={true} path={Routes.CONTACT} component={Contact}/>
                    <Route exact={true} path={Routes.CATEGORIES} component={Categories}/>
                    <Route exact={true} path={Routes.USER} component={UserInfo}/>
                    <Route exact={true} path={Routes.PRODUCT} component={ProductInfo}/>
                    <Route render={() => <Redirect to={Routes.LOGIN}/>}/>
                </Switch>
        </main>
    )
};
export default PageLayout;