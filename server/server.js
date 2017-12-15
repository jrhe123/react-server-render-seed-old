// src/server.js
import path from 'path';
import https from 'https';
import http from 'http'
import fs from 'fs';
import Express from 'express';
import React from 'react';
import bodyParser from 'body-parser';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../src/routes';
import NotFoundPage from '../src/pages/NotFoundPage';
import router from './controllers/api-routes';
import verification_router from './controllers/verification-routes';
import webpack from 'webpack';
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import dev_config from '../webpack/webpack.config.dev.js';
import reducers from '../src/reducers';


// initialize the server and configure support for ejs templates
const app = new Express();

const env = process.env.NODE_ENV || 'development';

let httpsOptions = {}

if(env === 'production') {
    httpsOptions = {
        key: fs.readFileSync('/home/opay_ssl/opay.key'),
        cert: fs.readFileSync('/home/opay_ssl/STAR_opay_ca.crt'),
        ca: [
            fs.readFileSync('/home/opay_ssl/AddTrustExternalCARoot.crt'),
            fs.readFileSync('/home/opay_ssl/COMODORSADomainValidationSecureServerCA.crt'),
            fs.readFileSync('/home/opay_ssl/COMODORSAAddTrustCA.crt'),
        ]
    }
}


const server = https.createServer(options,app);
//const server = http.createServer(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'../src','views'));
// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname,'../src','static')));
app.use(Express.static(__dirname));
app.use(bodyParser.json()); // handle json data
app.use('/api',router);
app.use('/verification',verification_router);

if(process.env.NODE_ENV === "development") { // development mode has hot replace funtion
  const dev_compiler = webpack(dev_config);
  app.use(webpackDevMiddleware(dev_compiler, {
    publicPath: dev_config.output.publicPath
  }));
  app.use(webpackHotMiddleware(dev_compiler, {
  }));
}
// universal routing and rendering
app.get('*', (req, res) => {
    match(
        { routes, location: req.url },
        (err, redirectLocation, renderProps) => {
            // in case of error display the error message
            if (err) {
                return res.status(500).send(err.message);
            }
            // in case of redirect propagate the redirect to the browser
            if (redirectLocation) {
                return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            }
            // generate the React markup for the current route
            let markup;
            let store = createStore(reducers);
            if (renderProps) {
                // if the current route matched we have renderProps
                markup = renderToString(<Provider store={store}><RouterContext {...renderProps}/></Provider>);
            } else {
                // otherwise we can render a 404 page
                markup = renderToString(<NotFoundPage/>);
                res.status(404);
            }
            // render the index template with the embedded React markup
            return res.render('index', { markup });
        }
    );
});

const port = (env === 'development') ? 3001 : 443;
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});
