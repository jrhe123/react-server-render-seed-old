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
import { 
    fetch_franchise_profile,
    fetch_profile_image,
} from '../actions/franchise_action';

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


class FranchiseSettingPage extends Component{

    constructor(props) {
        super(props);
        this.state = {

            userTypeID: null,

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

        this.setState({
            userTypeID: localStorage.getItem('userTypeID')
        })
       
        apiManager.opayApi(opay_url+'franchise/view', null, true)
            .then((response) => {
                
                let franchise = response.data.Response.User;                
                let profile = {
                    agentID: franchise.AgentID,
                    firstName: franchise.FirstName,
                    lastName: franchise.LastName,
                    email: franchise.Email,
                    phoneNumber: franchise.PhoneNumber,
                    faxNumber: franchise.FaxNumber
                }
                this.props.fetch_franchise_profile(profile);
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
        let { agentID, firstName, lastName, email, phoneNumber, faxNumber } = tempProfile;

        phoneNumber = phoneNumber ? formattor.removeFormatPhoneNumber(phoneNumber.toString()) : null;
        faxNumber = faxNumber ? formattor.removeFormatPhoneNumber(faxNumber.toString()) : null;
        
        if(!firstName){
            this.handleTouchTap(`Merchant name is required`, false);
        }else if(!lastName){
            this.handleTouchTap(`Legal name is required`, false);
        }else if(!validator.isEmail(email)){
            this.handleTouchTap(`Invalid email address`, false);
        }else if(this.state.userTypeID == 2 && phoneNumber.toString().length != 10){
            this.handleTouchTap(`Invalid phone number`, false);
        }else{

            let params = {
                Params: {
                    FirstName: firstName,
                    LastName: lastName,
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
        }else if(!newPassword || newPassword.length < 6){
            this.handleTouchTap(`New password must be at least 6 characters`, false);
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

            apiManager.opayApi(opay_url+'franchise/update_password', params, true)
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

    handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        if(file){

            if(file.type != "image/jpeg"
                && file.type != "image/jpg"
                && file.type != "image/gif"
                && file.type != "image/png"
            ){
                this.handleTouchTap(`Please select one of these image type: [jpg, jpeg, png, gif]`, false);
            }else{

                let formData = new FormData();
                formData.append('File', file);
                apiManager.opayFileApi(opay_url + 'upload/image', formData, true)
                    .then((response) => {
                        if(response.data.Confirmation === 'Success'){
                            let img = response.data.Response.Image.ImageGUID;
                            localStorage.setItem('profileImage', img);
                            this.props.fetch_profile_image(img);
                        }else{
                            this.handleTouchTap(`${response.data.Message}`, false);
                        }
                    })
                    .catch((error) => {
                        this.handleTouchTap(`Error: Upload image failed`, false);
                    })
            }            
        }
    }
    

    render() {

        const {
            mainContainer,
            formControl,
            btnControl,
            profileImgContainer,
            profileImg,
            avatarBtn,
        } = styles;

        if(!this.props.profile){
            return null;
        }

        return (
            <MuiThemeProvider>

                <div style={mainContainer}>

                    <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                        {
                            this.props.img != "" ? 
                            (
                                <CardHeader
                                    style={{height: 220}}
                                    titleStyle={{fontSize: 20}}
                                    title={this.props.profile ? formattor.capitalStr(this.props.profile.firstName) : ''}
                                    subtitle={
                                        this.props.profile ? 
                                        (
                                            <div>
                                                <p style={{fontSize: 14}}>{this.props.profile.lastName}</p>
                                            </div>
                                        )
                                        : 
                                        (null)
                                    }
                                    avatar={
                                        <div style={profileImgContainer}>
                                            <img style={profileImg} src={`${opay_url}picture?ImageGUID=${this.props.img}&ThumbSize=250X250`} />
                                            <a style={avatarBtn} 
                                                onClick={(e) => this.myInput.click() }
                                            >CHANGE AVATAR</a>
                                        </div>
                                    }
                                />
                            )
                            :
                            (
                                <CardHeader
                                    style={{height: 220}}
                                    titleStyle={{fontSize: 20}}
                                    title={this.props.profile ? this.props.profile.firstName : ''}
                                    subtitle={
                                        this.props.profile ? 
                                        (
                                            <div>
                                                <p style={{fontSize: 14}}>{this.props.profile.lastName}</p>
                                            </div>
                                        )
                                        : 
                                        (null)
                                    }
                                    avatar={
                                        <div style={profileImgContainer}>
                                            <img style={profileImg} src="/img/avatar.png" />
                                            <a style={avatarBtn} 
                                                onClick={(e) => this.myInput.click() }
                                            >CHANGE AVATAR</a>
                                        </div>
                                    }
                                />
                            )
                        }
                        <input 
                            id="myInput" 
                            type="file" 
                            ref={(ref) => this.myInput = ref}
                            style={{ display: 'none' }} 
                            onChange={(e) => this.handleImageChange(e)}
                        />
                        <Divider />
                        <List style={{marginBottom: 24}}>
                            <ListItem style={{height: 48}} primaryText={this.props.profile.agentID} leftIcon={<ActionAccountBox />} />
                            <ListItem style={{height: 48}} primaryText={this.props.profile.email} leftIcon={<CommunicationEmail />} />
                        </List>
                        <Divider />
                        {
                            this.state.userTypeID == 7 ?
                            (null)
                            :
                            (
                                <CardActions>
                                    {/* <FlatButton label="Edit Profile"
                                                onClick={this.handleOpen.bind(this)}
                                                primary={true} 
                                                icon={<ActionBuild />} /> */}
                                    <FlatButton label="Change Password" 
                                                onClick={this.handleOpenPass.bind(this)}
                                                primary={true} 
                                                icon={<ActionHttps />} />
                                </CardActions>
                            )
                        }
                    </Card>    

                </div>

                <Dialog
                        title="Profile"
                        modal={false}
                        open={this.state.profileModalOpen}
                        onRequestClose={this.handleClose.bind(this)}
                    >   
                        <div style={formControl}>
                            <TextField floatingLabelText="Merchant Name" 
                                        defaultValue={this.props.profile.firstName}
                                        value={this.state.firstName}
                                        onChange={(e, value) => this.onFieldChange(e,value,'firstName')}
                                        />
                        </div>
                        <div style={formControl}>
                            <TextField floatingLabelText="Legal Name" 
                                        defaultValue={this.props.profile.lastName}
                                        value={this.state.lastName}
                                        onChange={(e, value) => this.onFieldChange(e,value,'lastName')}
                                        />
                        </div>
                        <div style={formControl}>
                            <TextField floatingLabelText="Email" 
                                        defaultValue={this.props.profile.email}
                                        value={this.state.email}
                                        onChange={(e, value) => this.onFieldChange(e,value,'email')}
                                        />
                        </div>
                        <div style={formControl}>
                            <TextField floatingLabelText="PhoneNumber">
                                <InputMask mask="(999)999-9999" 
                                            maskChar=" "
                                            defaultValue={this.props.profile.phoneNumber} 
                                            value={this.state.phoneNumber}
                                            onChange={(e) => this.onMaskFieldChange(e,'phoneNumber')} />        
                            </TextField>            
                        </div>    
                        {
                            this.state.userTypeID == 2 ?
                            (
                                <div style={formControl}>
                                    <TextField floatingLabelText="FaxNumber">
                                        <InputMask mask="(999)999-9999" 
                                                    maskChar=" "
                                                    defaultValue={this.props.profile.faxNumber} 
                                                    value={this.state.faxNumber}
                                                    onChange={(e, value) => this.onMaskFieldChange(e,'faxNumber')} />          
                                    </TextField>            
                                </div>
                            )
                            :
                            (null)
                        }
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
    profileImgContainer: {
        width: 180,
        height: 180,
        float: 'left'
    },
    profileImg: {
        display: 'block',
        margin: '0 auto',
        width: 160,
        height: 160,
        borderRadius: '6px',
        backgroundColor: '#c9c9c9'
    },
    avatarBtn: {
        display: 'block',
        margin: '0 auto',  
        marginTop: 12,
        textAlign: 'center',      
        cursor: 'pointer',
        fontSize: 12,
        color: '#728b9a'
    }
}

const stateToProps = (state) => {

	return {
        profile: state.franchise_reducer.profile,
        img: state.franchise_reducer.img
	}
}

const dispatchToProps = (dispatch) => {

	return {
        fetch_franchise_profile: (profile) => dispatch(fetch_franchise_profile(profile)),
        fetch_profile_image: (img) => dispatch(fetch_profile_image(img))
	}
}

export default connect(stateToProps, dispatchToProps)(FranchiseSettingPage);                 