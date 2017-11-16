import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

// Redux
import { connect } from 'react-redux';
import { hideHeader, showSnackbar }  from '../actions/layout_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

// Components
import Loading from '../components/Loading';
import MerchantTransactions from '../components/MerchantTransactions';
import MerchantEmployees from '../components/MerchantEmployees';


class MerchantAdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            tab: 'transactions',
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
        let token = localStorage.getItem('token');
        setTimeout(() => { 
            if(!token){
                browserHistory.push(`${root_page}`);
            }else{
                this.setState({
                    isLoading: false,
                })
            }
        }, 1000);
        
        window.addEventListener('resize', this.refactor);
    }

    logout = () => {
        apiManager.opayApi(opay_url+'user/logout', null, true)
            .then((response) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                browserHistory.push(`${root_page}`);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                browserHistory.push(`${root_page}`);
            })
    }

    switchTab(tab){
        this.setState({
            tab
        })
    }

    renderTab(tab) {
        switch(tab) {
            case 'transactions':
                return (
                    <MerchantTransactions />
                );
            case 'employees':
                return (
                    <MerchantEmployees />
                );
            default:
                return (
                    <MerchantTransactions />
                );
        }
    }

    render() {

        const {
            mainContainer,
            drawerContainer,
            contentContainer,
            loadingContainer,
        } = styles;

        if(this.state.isLoading){
            return (
                <div style={loadingContainer}>
                    <Loading />
                </div>
            )
        }

        return (
            <MuiThemeProvider>
                <div style={mainContainer}>
                    <div style={drawerContainer}>
                        <Drawer open={true} width={160}>
                            <MenuItem primaryText="Transactions" onClick={this.switchTab.bind(this, 'transactions')} />
                            <MenuItem primaryText="Employees" onClick={this.switchTab.bind(this, 'employees')} />
                            <MenuItem primaryText="Log out" onClick={this.logout} />
                        </Drawer>
                    </div>
                    <div style={contentContainer}>
                        { this.renderTab(this.state.tab) }
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {

    mainContainer: {
        width: '100vw',
        height: '100vh',
    },
    drawerContainer: {
        display: 'inline-block', 
        float: 'left',
        width: '160px',
        height: '100vh'
    },
    contentContainer: {
        display: 'inline-block', 
        float: 'left',
        width: 'calc(100% - 160px)',
        height: '100vh'
    },
    loadingContainer: {
        width: '100vw',
        height: '100vh',
    }

}

export default connect()(MerchantAdminPage);