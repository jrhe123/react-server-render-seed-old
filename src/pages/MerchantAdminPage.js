import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import { hideHeader }  from '../actions/layout_action';

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


    render() {

        const {
            mainMerchantAdminPageStyle,
        } = styles;


        return (
            <MuiThemeProvider>
                <div style={mainMerchantAdminPageStyle}>

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