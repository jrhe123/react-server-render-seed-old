import { combineReducers } from 'redux';
import layout_reducer from './reducers/layout_reducer';
import snackbar_reducer from './reducers/snackbar_reducer'
import login_reducer from './reducers/login_reducer'
import socket_reducer from './reducers/socket_reducer'
import merchant_reducer from './reducers/merchant_reducer'
import customer_reducer from './reducers/customer_reducer'
import admin_reducer from './reducers/admin_reducer'
import franchise_reducer from './reducers/franchise_reducer'


const reducer = combineReducers({
    layout_reducer,
    snackbar_reducer,
    login_reducer,
    socket_reducer,
    merchant_reducer,
    customer_reducer,
    admin_reducer,
    franchise_reducer
});

export default reducer;