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
import validator from 'validator';



// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';
import { fetch_merchant_profile }  from '../actions/merchant_action';

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
            passwordModalOpen: false,
            profileModalOpen: false,
            open: false,
            message: '',
            success: true,

            agentID: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            faxNumber: '',

            oldPassword: '',
            newPassword: '',
            newPasswordErrMsg: '',
            confirmPassword: '',
            confirmPasswordErrMsg: ''
        }
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    componentDidMount(){
       
        apiManager.opayApi(opay_url+'merchant/view_profile', null, true)
            .then((response) => {
                
                let merchant = response.data.Response;
                let profile = {
                    agentID: merchant.AgentID,
                    firstName: merchant.FirstName,
                    lastName: merchant.LastName,
                    email: merchant.Email,
                    phoneNumber: merchant.PhoneNumber,
                    faxNumber: merchant.FaxNumber
                }
                this.props.fetch_merchant_profile(profile);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                browserHistory.push(`${root_page}`);
            }) 
    }

    componentWillReceiveProps(nextProps) {
        let profile = nextProps.profile;
        let { agentID, email, faxNumber, firstName, lastName, phoneNumber } = profile;
        this.setState({
            agentID,
            email,
            faxNumber,
            firstName,
            lastName,
            phoneNumber
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
        this.setState({profileModalOpen: true});
    };

    handleClose = () => {
        this.setState({profileModalOpen: false});
    };

    handleOpenPass = () => {
        this.setState({passwordModalOpen: true});
    };

    handleClosePass = () => {
        this.setState({passwordModalOpen: false});
    };

    onFieldChange = (e, value, field) => {
        let updated = Object.assign({}, this.state);
        updated[field] = value;
        this.setState(updated);
    }

    onMaskFieldChange = (e, field) => {
        let updated = Object.assign({}, this.state);
        updated[field] = e.target.value;
        this.setState(updated);
    }

    handleUpdatePriofile = () => {
        
        let tempProfile = Object.assign({}, this.state);
        let { agentID, email, phoneNumber, faxNumber } = tempProfile;

        phoneNumber = formattor.removeFormatPhoneNumber(phoneNumber.toString());
        faxNumber = formattor.removeFormatPhoneNumber(faxNumber.toString());
        
        if(!validator.isEmail(email)){
            this.handleTouchTap(`Invalid email address`, false);
        }else if(phoneNumber.toString().length != 10){
            this.handleTouchTap(`Invalid phone number`, false);
        }else{

            let params = {
                Params: {
                    Email: email,
                    PhoneNumber: phoneNumber,
                    FaxNumber: faxNumber
                }
            };
            apiManager.opayApi(opay_url+'merchant/update_profile', params, true)
                .then((response) => {
                    if(response.data.Confirmation === 'Success'){
                        let merchant = response.data.Response;
                        let profile = {
                            agentID: merchant.AgentID,
                            firstName: merchant.FirstName,
                            lastName: merchant.LastName,
                            email: merchant.Email,
                            phoneNumber: merchant.PhoneNumber,
                            faxNumber: merchant.FaxNumber
                        }
                        this.props.fetch_merchant_profile(profile);
                        this.handleTouchTap(`Profile has been updated`, true);
                        this.handleClose();
                    }else{
                        this.handleTouchTap(`${response.data.Message}`, false);
                    }
                })
                .catch((error) => {
                    this.handleTouchTap(`Error: ${error}`, false);
                })
        }
    }

    onFieldBlur = (field, e) => {

        let value = e.target.value;
        if(field === 'newPassword'){
            if(value.length < 6){
                let updated = Object.assign({}, this.state);
                updated['newPasswordErrMsg'] = "Password must be at least 6 characters";
                this.setState(updated);
            }else{
                let updated = Object.assign({}, this.state);
                updated['newPasswordErrMsg'] = '';
                this.setState(updated);
            }
        }
    }

    handleConfirmKeyup = (e) => {
        if(this.state.newPassword !== e.target.value){
            this.setState({
                confirmPasswordErrMsg: 'Must match the previous entry'
            })
        }else{
            this.setState({
                confirmPasswordErrMsg: ''
            })
        }
    }

    handleUpdatePassword = () => {

        let agentID = localStorage.getItem('agentID');
        let loginKeyword = localStorage.getItem('loginKeyword');
        let oldPassword = this.state.oldPassword;
        let newPassword = this.state.newPassword;
        let confirmPassword = this.state.confirmPassword;

        if(!agentID){
            this.handleTouchTap(`Agent ID not found. Please login again.`, false);
        }else if(!loginKeyword){
            this.handleTouchTap(`User name not found. Please login again`, false);
        }else if(!oldPassword){
            this.handleTouchTap(`Old password is required`, false);
        }else if(!newPassword){
            this.handleTouchTap(`New password is required`, false);
        }else if(newPassword !== confirmPassword){
            this.handleTouchTap(`Please confirm your new password`, false);
        }else{

            let params = {
                Params: {
                    AgentID: agentID,
                    LoginKeyword: loginKeyword,
                    Password: oldPassword,
                    NewPassword: newPassword
                }
            };
            apiManager.opayApi(opay_url+'user/update_password', params, true)
                .then((response) => {
                    if(response.data.Confirmation === 'Success'){
                        this.handleTouchTap(`Password has been updated`, true);
                        this.handleClosePass();
                    }else{
                        this.handleTouchTap(`${response.data.Message}`, false);
                    }
                })
                .catch((error) => {
                    this.handleTouchTap(`Error: ${error}`, false);
                })
        }
    }
    

    render() {

        const {
            mainContainer,
            formControl,
            btnControl,
        } = styles;

        if(!this.props.profile){
            return null;
        }

        return (
            <MuiThemeProvider>

                <div style={mainContainer}>

                    <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                        <CardHeader
                            title={this.props.profile ? this.props.profile.firstName : ''}
                            subtitle={this.props.profile ? this.props.profile.lastName : ''}
                            avatar="/img/avatar.png"
                        />
                        <Divider />
                        <List style={{marginBottom: 24}}>
                            <ListItem primaryText={this.props.profile.agentID} leftIcon={<ActionAccountBox />} />
                            <ListItem primaryText={this.props.profile.email} leftIcon={<CommunicationEmail />} />
                            <ListItem primaryText={this.props.profile.phoneNumber ? formattor.addFormatPhoneNumber(this.props.profile.phoneNumber) : ''} leftIcon={<CommunicationPhone />} />
                            <ListItem primaryText={this.props.profile.faxNumber ? formattor.addFormatPhoneNumber(this.props.profile.faxNumber) : ''} leftIcon={<CommunicationBusiness />} />
                        </List>
                        <Divider />
                        <CardActions>
                            <FlatButton label="Edit Profile"
                                        onClick={this.handleOpen.bind(this)}
                                        primary={true} 
                                        icon={<ActionBuild />} />
                            <FlatButton label="Change Password" 
                                        onClick={this.handleOpenPass.bind(this)}
                                        primary={true} 
                                        icon={<ActionHttps />} />
                        </CardActions>
                    </Card>    

                </div>

                <Dialog
                        title="Profile"
                        modal={false}
                        open={this.state.profileModalOpen}
                        onRequestClose={this.handleClose.bind(this)}
                    >
                        <div style={formControl}>
                            <TextField floatingLabelText="Email" 
                                        defaultValue={this.props.profile.email}
                                        onChange={(e, value) => this.onFieldChange(e,value,'email')}
                                        />
                        </div>
                        <div style={formControl}>
                            <TextField floatingLabelText="PhoneNumber">
                                <InputMask mask="(999)999-9999" 
                                            maskChar=" "
                                            defaultValue={this.props.profile.phoneNumber} 
                                            onChange={(e) => this.onMaskFieldChange(e,'phoneNumber')} />        
                            </TextField>            
                        </div>    
                        <div style={formControl}>
                            <TextField floatingLabelText="FaxNumber">
                                <InputMask mask="(999)999-9999" 
                                            maskChar=" "
                                            defaultValue={this.props.profile.faxNumber} 
                                            onChange={(e, value) => this.onMaskFieldChange(e,'faxNumber')} />          
                            </TextField>            
                        </div>   
                        <div style={btnControl}>       
                            <RaisedButton label="Update" 
                                        primary={true}
                                        onClick={this.handleUpdatePriofile} />
                        </div> 
                </Dialog>

                <Dialog
                        title="Password"
                        modal={false}
                        open={this.state.passwordModalOpen}
                        onRequestClose={this.handleClosePass.bind(this)}
                    >
                        <div style={formControl}>
                            <TextField floatingLabelText="Old Password" 
                                type="password" 
                                onChange={(e, value) => this.onFieldChange(e,value,'oldPassword')}
                                />
                        </div>
                        <div style={formControl}>
                            <TextField floatingLabelText="New Password" 
                                type="password" 
                                errorText={this.state.newPasswordErrMsg}
                                onBlur={this.onFieldBlur.bind(this, 'newPassword')}
                                onChange={(e, value) => this.onFieldChange(e,value,'newPassword')}
                                />
                        </div>    
                        <div style={formControl}>
                            <TextField floatingLabelText="Confirm Password"
                                type="password"
                                errorText={this.state.confirmPasswordErrMsg}  
                                onKeyUp={(e, value) => this.handleConfirmKeyup(e)}
                                onChange={(e, value) => this.onFieldChange(e,value,'confirmPassword')}
                                />                                        
                        </div>   
                        <div style={btnControl}>       
                            <RaisedButton label="Update" 
                                        primary={true}
                                        onClick={this.handleUpdatePassword} />
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
		profile: state.merchant_reducer.profile,
	}
}

const dispatchToProps = (dispatch) => {

	return {
		fetch_merchant_profile: (profile) => dispatch(fetch_merchant_profile(profile))
	}
}

export default connect(stateToProps, dispatchToProps)(SettingPage);                 