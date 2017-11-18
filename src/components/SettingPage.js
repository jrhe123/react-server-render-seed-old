import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import CommunicationPhone from 'material-ui/svg-icons/communication/phone';
import CommunicationBusiness from 'material-ui/svg-icons/communication/business';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import ActionBuild from 'material-ui/svg-icons/action/build';
import ActionHttps from 'material-ui/svg-icons/action/https';
import Dialog from 'material-ui/Dialog';
import InputMask from 'react-input-mask';




// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';
import { fetch_merchant_pos_login }  from '../actions/merchant_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

// Component
import Snackbar from 'material-ui/Snackbar';

// helper
import * as formattor from '../helpers/formattor';


class SettingPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            open: false,
            message: '',
            success: true,

            agentID: '',
            firstName: '',
            lastName: '',
            email: '',
            disPhoneNumber: '',
            disFaxNumber: '',
            phoneNumber: '',
            faxNumber: ''
        }
    }

    componentDidMount(){
       
        apiManager.opayApi(opay_url+'merchant/view_profile', null, true)
            .then((response) => {
                
                let merchant = response.data.Response;
                let updated = Object.assign({}, this.state);
                updated.agentID = merchant.AgentID;
                updated.firstName = merchant.FirstName;
                updated.lastName = merchant.LastName;
                updated.email = merchant.Email;
                updated.phoneNumber = merchant.PhoneNumber;
                updated.faxNumber = merchant.FaxNumber;
                this.setState(updated);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                browserHistory.push(`${root_page}`);
            }) 
    }

    // Snack
    handleTouchTap = (msg, isSuccess) => {
        this.setState({
            open: true,
            message: msg,
            success: isSuccess
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    // Modal
    handleOpen = () => {
        this.setState({modalOpen: true});
    };

    handleClose = () => {
        this.setState({modalOpen: false});
    };

    onFieldChange = (e, value, field) => {
        // let updated = Object.assign({}, this.state);
        // updated[field] = value;
        // this.setState(updated);
    }

    handleUpdatePriofile = () => {
        
    }
    

    render() {

        const {
            mainContainer,
            formControl,
            btnControl,
        } = styles;


        return (
            <MuiThemeProvider>

                <div style={mainContainer}>

                    <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                        <CardHeader
                            title={this.state.firstName}
                            subtitle={this.state.lastName}
                            avatar="/img/avatar.png"
                        />
                        <List style={{marginBottom: 24}}>
                            <ListItem primaryText={this.state.agentID} leftIcon={<ActionAccountBox />} />
                            <ListItem primaryText={this.state.email} leftIcon={<CommunicationEmail />} />
                            <ListItem primaryText={formattor.addFormatPhoneNumber(this.state.phoneNumber)} leftIcon={<CommunicationPhone />} />
                            <ListItem primaryText={formattor.addFormatPhoneNumber(this.state.faxNumber)} leftIcon={<CommunicationBusiness />} />
                        </List>
                        <Divider />
                        <CardActions>
                            <FlatButton label="Edit Profile"
                                        onClick={this.handleOpen.bind(this)}
                                        primary={true} 
                                        icon={<ActionBuild />} />
                            <FlatButton label="Change Password" 
                                        primary={true} 
                                        icon={<ActionHttps />} />
                        </CardActions>
                        
                    </Card>    

                </div>

                <Dialog
                    title="Profile"
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={this.handleClose.bind(this)}
                >
                    <div style={formControl}>
                        <TextField floatingLabelText="Email" 
                                    defaultValue={this.state.email}
                                    onChange={(e, value) => this.onFieldChange(e,value,'email')}
                                    />
                    </div>
                    <div style={formControl}>
                        <TextField floatingLabelText="PhoneNumber">
                            <InputMask mask="(999)999-9999" 
                                        maskChar=" "
                                        defaultValue={this.state.phoneNumber} 
                                        onChange={(e, value) => this.onFieldChange(e,value,'phoneNumber')} />        
                        </TextField>            
                    </div>    
                    <div style={formControl}>
                        <TextField floatingLabelText="FaxNumber">
                            <InputMask mask="(999)999-9999" 
                                        maskChar=" "
                                        defaultValue={this.state.faxNumber} 
                                        onChange={(e, value) => this.onFieldChange(e,value,'faxNumber')} />          
                        </TextField>            
                    </div>   
                    <div style={btnControl}>       
                        <RaisedButton label="Update" 
                                    primary={true}
                                    onClick={this.handleUpdatePriofile} />
                    </div> 
                </Dialog>

                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                    bodyStyle={{backgroundColor: this.state.success ? green400 : pinkA400, textAlign: 'center' }}
                    />
            </MuiThemeProvider>
        )
    }
}

const styles = {

    mainContainer: {
        width: '100%',
        height: 'calc(100vh - 64px)',
    },

    formControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 12,
        marginBottom: 12
    },

    btnControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 36,
        marginBottom: 12
    },

}

const stateToProps = (state) => {

	return {
		// posLogin: state.merchant_reducer.posLogin,
	}
}

const dispatchToProps = (dispatch) => {

	return {
		// fetch_merchant_pos_login: (posLogin) => dispatch(fetch_merchant_pos_login(posLogin))
	}
}

export default connect(stateToProps, dispatchToProps)(SettingPage);