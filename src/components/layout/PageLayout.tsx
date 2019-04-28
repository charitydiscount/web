import * as React from "react";
import {Redirect, Route, Switch} from "react-router";
import {Routes} from "../helper/Routes";
import Login from "../login/LoginComponent";
import {BrowserRouter} from "react-router-dom";
import Contact from "../contact/Contact";
import Categories from "../products/Categories";
import Register from "../login/Register";
import Product from "../products/Product";
import LoginActor from "../login/LoginActor";
import {ConnectedRouter} from "connected-react-router";

const PageLayout = () => {
    return (
        <main>
                <Switch>
                    <Route exact={true} path={Routes.HOME} component={LoginActor}/>
                    <Route exact={true} path={Routes.CONTACT} component={Contact}/>
                    <Route exact={true} path={Routes.CATEGORIES} component={Categories}/>
                    <Route exact={true} path={Routes.REGISTER} component={Register}/>
                    <Route exact={true} path={Routes.PRODUCT} component={Product}/>
                    <Route render={() => <Redirect to={Routes.HOME}/>}/>
                </Switch>
        </main>
    )
};
export default PageLayout;