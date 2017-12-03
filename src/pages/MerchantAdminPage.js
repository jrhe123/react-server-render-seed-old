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
import ActionAndroid from 'material-ui/svg-icons/action/android';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import SocialPeople from 'material-ui/svg-icons/social/people';
import ActionSearch from 'material-ui/svg-icons/action/search';
import HardwareSmartphone from 'material-ui/svg-icons/hardware/smartphone';
import CommunicationBusiness from 'material-ui/svg-icons/communication/business';
import EditorShowChart from 'material-ui/svg-icons/editor/show-chart';
import HardwareDesktopWindows from 'material-ui/svg-icons/hardware/desktop-windows';


// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

// Components
import Loading from '../components/Loading';
import MerchantTransactions from '../components/MerchantTransactions';
import MerchantCharts from '../components/MerchantCharts';
import MerchantMonitor from '../components/MerchantMonitor';
import MerchantEmployees from '../components/MerchantEmployees';
import MerchantAddresses from '../components/MerchantAddresses';
import MerchantPOSMachines from '../components/MerchantPOSMachines';
import SettingPage from '../components/SettingPage';
import PosSettingPage from '../components/PosSettingPage';


class MerchantAdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            tab: 'monitor',
            open: false,
            userTypeID: null
        }
        this.refactor = this.refactor.bind(this);
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
        let userTypeID = localStorage.getItem('userTypeID');
        this.setState({
            userTypeID: userTypeID
        })
        setTimeout(() => { 
            if(!token){
                browserHistory.push(`${root_page}`);
            }else{
                this.setState({
                    isLoading: false
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
                localStorage.removeItem('loginKeyword');
                browserHistory.push(`${root_page}`);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
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
            case 'setting':
                return (
                    <SettingPage />
                );    
            case 'charts':
                return (
                    <MerchantCharts isLoading={this.state.isLoading}/>
                );   
            case 'monitor':
                return (
                    <MerchantMonitor isLoading={this.state.isLoading}/>
                );       
            case 'transactions':
                return (
                    <MerchantTransactions />
                );
            case 'employees':
                return (
                    <MerchantEmployees />
                );
            case 'posMachines':
                return (
                    <MerchantPOSMachines />
                );    
            case 'address':
                return (
                    <MerchantAddresses />
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
            logoContainer
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
                        style={{backgroundColor:'#fff', padding: 0}}
                        iconElementLeft={
                            <div style={logoContainer}></div>
                        }
                        iconElementRight={
                            <div>
                                <FlatButton
                                    style={{color: '#000', height: 64, marginTop: '-8px', paddingLeft: 12, paddingRight: 24, borderLeft: '1px solid #CCCCCC'}}
                                    onClick={this.handleTouchTap}
                                    label="Account"
                                    labelPosition="before"
                                    primary={true}
                                    icon={<HardwareKeyboardArrowDown />}
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
                                    <MenuItem primaryText="My Settings" onClick={this.switchTab.bind(this, 'setting')} />
                                    <MenuItem primaryText="Logout" onClick={this.logout} />
                                </Menu>
                                </Popover>
                            </div>
                        }
                    />
                </div>
                <div style={mainContainer}>
                    
                    <div style={drawerContainer}>
                        <Drawer open={true} width={220} containerStyle={{zIndex: 0, backgroundColor: '#123659'}}>
                            <MenuItem style={{marginTop: 72, color: '#fff'}} 
                                        primaryText="Transactions" 
                                        leftIcon={<ActionSearch color="#fff" />}
                                        onClick={this.switchTab.bind(this, 'transactions')} />
                            <MenuItem style={{color: '#fff'}} 
                                        primaryText="Summary" 
                                        leftIcon={<EditorShowChart color="#fff" />}
                                        onClick={this.switchTab.bind(this, 'charts')} />   
                            <MenuItem style={{color: '#fff'}} 
                                        primaryText="Monitor" 
                                        leftIcon={<HardwareDesktopWindows color="#fff" />}
                                        onClick={this.switchTab.bind(this, 'monitor')} />                     
                            <MenuItem style={{color: '#fff'}} 
                                        primaryText="Employee" 
                                        leftIcon={<SocialPeople color="#fff" />}
                                        onClick={this.switchTab.bind(this, 'employees')} />
                            {
                                (this.state.userTypeID == 2) ?
                                (
                                    <div>    
                                        <MenuItem style={{color: '#fff'}} 
                                            primaryText="POS" 
                                            leftIcon={<HardwareSmartphone color="#fff" />}
                                            onClick={this.switchTab.bind(this, 'posMachines')} />              
                                        <MenuItem style={{color: '#fff'}} 
                                                    primaryText="Address" 
                                                    leftIcon={<CommunicationBusiness color="#fff" />}
                                                    onClick={this.switchTab.bind(this, 'address')} />
                                    </div>            
                                )
                                :
                                (null)
                            }            
                                        
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
        height: '100vh - 64px',
    },
    drawerContainer: {
        display: 'inline-block', 
        float: 'left',
        width: '220px',
        height: 'calc(100vh - 64px)',
    },
    contentContainer: {
        display: 'inline-block', 
        float: 'left',
        width: 'calc(100% - 220px)',
        height: 'calc(100vh - 64px)',
        backgroundColor: '#F8F8F8'
    },
    loadingContainer: {
        width: '100vw',
        height: '100vh',
    },
    logoContainer: {
        backgroundColor: '#284F7A',
        height: 64,
        width: 220,
        marginTop: -8,
        marginLeft: 16
    }

}

export default connect()(MerchantAdminPage);