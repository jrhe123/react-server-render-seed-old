import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';



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
import SettingPage from '../components/SettingPage';


class MerchantAdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            tab: 'transactions',
            open: false,
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

    handleTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();
    
        this.setState({
          open: true,
          anchorEl: event.currentTarget,
        });
    };
    
    handleRequestClose = () => {
        this.setState({
          open: false,
        });
    };

    logout = () => {
        apiManager.opayApi(opay_url+'user/logout', null, true)
            .then((response) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                browserHistory.push(`${root_page}`);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                browserHistory.push(`${root_page}`);
            })
    }

    switchTab(tab){
        this.setState({
            tab: tab,
            open: false,
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
            case 'setting':
                return (
                    <SettingPage />
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
                <div style={{width: "100%", height: 64}}>
                    <AppBar
                        showMenuIconButton={false}
                        iconElementRight={
                            <div>
                                <FlatButton
                                    style={{color: '#fff', marginTop: 6}}
                                    onClick={this.handleTouchTap}
                                    label="Account"
                                />
                                <Popover
                                    open={this.state.open}
                                    anchorEl={this.state.anchorEl}
                                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                    onRequestClose={this.handleRequestClose}
                                    animation={PopoverAnimationVertical}
                                >
                                <Menu>
                                    <MenuItem primaryText="Setting" onClick={this.switchTab.bind(this, 'setting')} />
                                    <MenuItem primaryText="POS" />
                                    <MenuItem primaryText="Sign out" onClick={this.logout} />
                                </Menu>
                                </Popover>
                            </div>
                        }
                    />
                </div>
                <div style={mainContainer}>
                    <div style={drawerContainer}>
                        <Drawer open={true} width={160} containerStyle={{zIndex: 0}}>
                            <MenuItem style={{paddingTop: 64}} primaryText="Transactions" onClick={this.switchTab.bind(this, 'transactions')} />
                            <MenuItem primaryText="Employees" onClick={this.switchTab.bind(this, 'employees')} />
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
        height: '100vh - 64px)',
    },
    drawerContainer: {
        display: 'inline-block', 
        float: 'left',
        width: '160px',
        height: 'calc(100vh - 64px)',
    },
    contentContainer: {
        display: 'inline-block', 
        float: 'left',
        width: 'calc(100% - 160px)',
        height: 'calc(100vh - 64px)'
    },
    loadingContainer: {
        width: '100vw',
        height: '100vh',
    }

}

export default connect()(MerchantAdminPage);