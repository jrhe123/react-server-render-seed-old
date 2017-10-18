// src/routes.js
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './pages/Layout';
import NotFoundPage from './pages/NotFoundPage';
import MainPage from './pages/MainPage';
import AboutUs from './pages/AboutUs';
import NewMainPage from './pages/NewMainPage';
import Feature from './pages/Feature';
import NewAboutUs from './pages/NewAboutUs';
import { root_page } from './utilities/urlPath'

const root_url = root_page === '/' ? root_page : root_page.substr(0,root_page.length-1);

const routes = (
    <Route path={root_url} component={Layout}>
        <IndexRoute component={NewMainPage}/>
        <Route path="feature" component={Feature} />
        <Route path="about" component={NewAboutUs} />
        <Route path="*" component={NotFoundPage}/>
    </Route>
);

export default routes;
