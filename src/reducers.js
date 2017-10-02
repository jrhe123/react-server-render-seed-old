import { combineReducers } from 'redux';
import layout_reducer from './reducers/layout_reducer';
import snackbar_reducer from './reducers/snackbar_reducer'
import login_reducer from './reducers/login_reducer'
import socket_reducer from './reducers/socket_reducer'

const reducer = combineReducers({
    layout_reducer,
    snackbar_reducer,
    login_reducer,
    socket_reducer
});

export default reducer;