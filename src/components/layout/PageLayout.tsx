import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Routes } from '../helper/Routes';
import Contact from '../contact/Contact';
import Shops from '../products/Shops';
import LoginActor from '../login/LoginActor';
import UserInfo from '../login/UserInfo';
import HotDeals from '../deals/HotDeals';
import Causes from '../causes/Causes';

const PageLayout = () => {
  return (
    <main>
      <Switch>
        <Route exact={true} path={Routes.LOGIN} component={LoginActor} />
        <Route exact={true} path={Routes.REGISTER} component={LoginActor} />
        <Route exact={true} path={Routes.CONTACT} component={Contact} />
        <Route exact={true} path={Routes.CATEGORIES} component={Shops} />
        <Route exact={true} path={Routes.DEALS} component={HotDeals} />
        <Route exact={true} path={Routes.USER} component={UserInfo} />
        <Route exact={true} path={Routes.CAUSES} component={Causes} />
        <Route render={() => <Redirect to={Routes.LOGIN} />} />
      </Switch>
    </main>
  );
};
export default PageLayout;
