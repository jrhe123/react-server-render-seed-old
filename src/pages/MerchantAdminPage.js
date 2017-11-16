import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import { hideHeader }  from '../actions/layout_action';
import { root_page } from '../utilities/urlPath'
import * as apiManager from '../helpers/apiManager';

class MerchantAdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
        }
        this.refactor = this.refactor.bind(this);

        this.props.dispatch(hideHeader(true));
    }

    refactor = () => {
        const width = window.innerWidth;
        if(width <= 414) {
        } else if(width <= 768) {
        } else {
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.refactor);
    }

    logout = () => {
        browserHistory.push(`${root_page}`);
    }

    render() {

        const {
            mainMerchantAdminPageStyle,
        } = styles;

        return (
            <MuiThemeProvider>
                <div style={mainMerchantAdminPageStyle}>
                    <div>
                        <Drawer open={true} width={160}>
                            <MenuItem primaryText="Transactions" />
                            <MenuItem primaryText="Employee" />
                            <MenuItem primaryText="Log out" onClick={this.logout} />
                        </Drawer>
                    </div>
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

export default connect()(MerchantAdminPage);