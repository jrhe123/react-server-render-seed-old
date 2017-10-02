// src/routes.js
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './pages/Layout';
import NotFoundPage from './pages/NotFoundPage';
import MainPage from './pages/MainPage';
import AboutUs from './pages/AboutUs';
import { root_page } from './utilities/urlPath'

const root_url = root_page === '/' ? root_page : root_page.substr(0,root_page.length-1);

const routes = (
    <Route path={root_url} component={Layout}>
        <IndexRoute component={MainPage}/>
        <Route path="about" component={AboutUs} />
        <Route path="*" component={NotFoundPage}/>
    </Route>
);

export default routes;
