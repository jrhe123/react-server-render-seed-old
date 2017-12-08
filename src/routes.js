// src/routes.js
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './pages/Layout';
import NotFoundPage from './pages/NotFoundPage';
import NewMainPage from './pages/NewMainPage';
import Feature from './pages/Feature';
import NewAboutUs from './pages/NewAboutUs';
import WebSiteTerm  from './pages/WebSiteTerm';
import PrivacyPolicy  from './pages/PrivacyPolicy';

import MerchantRegisterPage from './pages/MerchantRegisterPage';
import MerchantLoginPage from './pages/MerchantLoginPage';
import MerchantAdminPage from './pages/MerchantAdminPage'

import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';

import { root_page } from './utilities/urlPath'

const root_url = root_page === '/' ? root_page : root_page.substr(0,root_page.length-1);

const routes = (
    <Route path={root_url} component={Layout}>
        <IndexRoute component={NewMainPage}/>
        <Route path="feature" component={Feature} />
        <Route path="about" component={NewAboutUs} />
        <Route path="merchantregister" component={MerchantRegisterPage} />
        <Route path="merchantlogin" component={MerchantLoginPage} />
        <Route path="merchantadmin" component={MerchantAdminPage} />
        <Route path="websiteterm" component={WebSiteTerm} />
        <Route path="privacypolicy" component={PrivacyPolicy} />
        <Route path="*" component={NotFoundPage}/>
    </Route>
);

/*
<Route path="3b8ff9b" component={AdminLoginPage} />
        <Route path="042481b" component={AdminPage} />
* */

export default routes;

