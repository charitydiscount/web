import * as React from "react";
import {Redirect, Route, Switch} from "react-router";
import {Routes} from "../helper/Routes";
import Contact from "../contact/Contact";
import Categories from "../products/Categories";
import Product from "../products/Product";
import LoginActor from "../login/LoginActor";
import RegisterActor from "../login/RegisterActor";

const PageLayout = () => {
    return (
        <main>
                <Switch>
                    <Route exact={true} path={Routes.HOME} component={LoginActor}/>
                    <Route exact={true} path={Routes.REGISTER} component={RegisterActor}/>
                    <Route exact={true} path={Routes.CONTACT} component={Contact}/>
                    <Route exact={true} path={Routes.CATEGORIES} component={Categories}/>
                    <Route exact={true} path={Routes.PRODUCT} component={Product}/>
                    <Route render={() => <Redirect to={Routes.HOME}/>}/>
                </Switch>
        </main>
    )
};
export default PageLayout;