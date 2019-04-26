import * as React from "react";
import {Redirect, Route, Switch} from "react-router";
import {Routes} from "../helper/Routes";
import Login from "../login/Login";
import Products from "../products/Products";
import {BrowserRouter} from "react-router-dom";
import Contact from "../contact/Contact";
import Categories from "../products/Categories";

const PageLayout = () => {
    return (
        <main>
            <BrowserRouter>
                <Switch>
                    <Route exact={true} path={Routes.LOGIN} component={Login}/>
                    <Route exact={true} path={Routes.CONTACT} component={Contact}/>
                    <Route exact={true} path={Routes.CATEGORIES} component={Categories}/>
                    <Route exact={true} path={Routes.HOME} component={Products}/>
                    <Route render={() => <Redirect to={Routes.HOME}/>}/>
                </Switch>
            </BrowserRouter>
        </main>
    )
};
export default PageLayout;