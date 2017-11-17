import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

class MerchantEmplyees extends Component{

    componentDidMount(){
        console.log('load employ');
    }

    render() {

        const {
            mainMerchantAdminPageStyle,
        } = styles;

        return (
            <MuiThemeProvider>
                <div style={mainMerchantAdminPageStyle}>
                    employee Component
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {

    mainMerchantAdminPageStyle: {
        width: '100vw',
        height: '100vh',
    },

}

export default connect()(MerchantEmplyees);