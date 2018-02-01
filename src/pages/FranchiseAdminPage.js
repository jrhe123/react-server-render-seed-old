import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ActionSearch from 'material-ui/svg-icons/action/search';


// Redux
import { connect } from 'react-redux';
import {
    fetch_profile_image
} from '../actions/merchant_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

// Components
import Loading from '../components/Loading';
import FranchiseTransactions from '../components/FranchiseTransactions';
import FranchiseSettingPage from '../components/FranchiseSettingPage';


class FranchiseAdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            tab: 'charts',
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

        if(localStorage.getItem('profileImage') != ''){
            this.props.fetch_profile_image(localStorage.getItem('profileImage'));
        }

        setTimeout(() => {
            if(!token){
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                localStorage.removeItem('profileImage');
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
        apiManager.opayApi(opay_url+'franchise/logout', null, true)
            .then((response) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                localStorage.removeItem('profileImage');
                browserHistory.push(`${root_page}`);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                localStorage.removeItem('profileImage');
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
                    <FranchiseSettingPage />
                );
            case 'transactions':
                return (
                    <FranchiseTransactions />
                );
            default:
                return (
                    <FranchiseTransactions />
                );
        }
    }

    render() {

        const {
            mainContainer,
            drawerContainer,
            contentContainer,
            loadingContainer,
            logoContainer,
            profileImgContainer,
            profileImg
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
                        className="merchant-app-bar"
                        style={{backgroundColor:'#fff', padding: 0}}
                        iconElementLeft={
                            <div style={logoContainer}></div>
                        }
                        iconElementRight={
                            <div>
                                <div style={profileImgContainer}>
                                    {
                                        this.props.img != "" ?
                                            (
                                                <img style={profileImg} src={`${opay_url}picture?ImageGUID=${this.props.img}&ThumbSize=250X250`} />
                                            )
                                            :
                                            (
                                                <img style={profileImg} src="/img/avatar.png" />
                                            )
                                    }
                                </div>
                                <FlatButton
                                    style={{color: '#000', height: 64, paddingRight: 24}}
                                    onClick={this.handleTouchTap}
                                    label="Account"
                                    labelPosition="before"
                                    primary={true}
                                    hoverColor="#fff"
                                    icon={<HardwareKeyboardArrowDown />}
                                />
                                <Popover
                                    className="merchant-app-bar-pop"
                                    open={this.state.open}
                                    anchorEl={this.state.anchorEl}
                                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                    onRequestClose={this.handleRequestClose}
                                    animation={PopoverAnimationVertical}
                                    autoWidth={true}
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
    },
    profileImgContainer: {
        float: 'left',
        borderLeft: '1px solid #CCCCCC',
        paddingLeft: 12,
        height: 64,
        cursor: 'pointer',
    },
    profileImg: {
        display: 'block',
        width: 40,
        height: 40,
        marginTop: 12,
        borderRadius: '50%'
    }

}

const stateToProps = (state) => {
    return {
        img: state.merchant_reducer.img
    }
}

const dispatchToProps = (dispatch) => {
    return {
        fetch_profile_image: (img) => dispatch(fetch_profile_image(img)),
    }
}

export default connect(stateToProps, dispatchToProps)(FranchiseAdminPage);