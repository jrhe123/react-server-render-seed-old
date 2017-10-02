// src/app-client.js
import React from 'react';
import ReactDOM from 'react-dom';
import "babel-polyfill";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import AppRoutes from './components/AppRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'bootstrap/dist/css/bootstrap.css';
import reducers from './reducers';
injectTapEventPlugin();


let store = createStore(reducers, applyMiddleware(thunk));


window.onload = () => {
    ReactDOM.render(
        <Provider store={store}>
            <AppRoutes/>
        </Provider>
        , document.getElementById('main'));
}



