import * as React from "react";
import {Redirect, Route, Switch} from "react-router";
import {Routes} from "../helper/Routes";
import Login from "../login/Login";
import Products from "../products/Products";
import {BrowserRouter} from "react-router-dom";
import Contact from "../contact/Contact";
import Categories from "../products/Categories";
import Register from "../login/Register";
import Product from "../products/Product";

const PageLayout = () => {
    return (
        <main>
            <BrowserRouter>
                <Switch>
                    <Route exact={true} path={Routes.LOGIN} component={Login}/>
                    <Route exact={true} path={Routes.CONTACT} component={Contact}/>
                    <Route exact={true} path={Routes.CATEGORIES} component={Categories}/>
                    <Route exact={true} path={Routes.HOME} component={Products}/>
                    <Route exact={true} path={Routes.REGISTER} component={Register}/>
                    <Route exact={true} path={Routes.PRODUCT} component={Product}/>
                    <Route render={() => <Redirect to={Routes.HOME}/>}/>
                </Switch>
            </BrowserRouter>
        </main>
    )
};
export default PageLayout;