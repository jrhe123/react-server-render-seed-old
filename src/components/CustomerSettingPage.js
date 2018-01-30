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
import EditorMonetizationOn from 'material-ui/svg-icons/editor/monetization-on';
import Dialog from 'material-ui/Dialog';
import InputMask from 'react-input-mask';
import validator from 'validator';


// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';
import { 
    fetch_customer_img, 
} from '../actions/customer_action';

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


class CustomerSettingPage extends Component{

    constructor(props) {
        super(props);
        this.state = {

            userTypeID: null,
            open: false,
            message: '',
            success: true,

            profile: {}
        }
    }

    componentDidMount(){

        this.setState({
            userTypeID: localStorage.getItem('userTypeID')
        })
       
        apiManager.opayApi(opay_url+'customer/view', null, true)
            .then((response) => {
                
                let customer = response.data.Response.User;
                let profile = {
                    firstName: customer.FirstName,
                    lastName: customer.LastName,
                    email: customer.Email,
                    phoneNumber: customer.PhoneNumber,
                    balance: customer.Balance,
                }
                this.setState({
                    profile
                })
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('profileImage');
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
                            this.props.fetch_customer_img(img);
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

        if(!this.state.profile){
            return null;
        }

        return (
            <MuiThemeProvider>

                <div style={mainContainer}>

                    <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                        {
                            this.state.img != "" ? 
                            (
                                <CardHeader
                                    style={{height: 220}}
                                    titleStyle={{fontSize: 20}}
                                    title={this.state.profile ? this.state.profile.firstName : ''}
                                    subtitle={
                                        this.state.profile ? 
                                        (
                                            <div>
                                                <p style={{fontSize: 14}}>{this.state.profile.lastName}</p>
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
                                    title={this.state.profile ? this.state.profile.firstName : ''}
                                    subtitle={
                                        this.state.profile ? 
                                        (
                                            <div>
                                                <p style={{fontSize: 14}}>{this.state.profile.lastName}</p>
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
                            <ListItem style={{height: 48}} primaryText={this.state.profile.email} leftIcon={<CommunicationEmail />} />
                            <ListItem primaryText={this.state.profile.phoneNumber ? formattor.addFormatPhoneNumber(this.state.profile.phoneNumber) : (<div style={{height: 16}}></div>)} leftIcon={<CommunicationPhone />} />
                            <ListItem primaryText={"$"+parseFloat(this.state.profile.balance).toFixed(2)} leftIcon={<EditorMonetizationOn />} />
                        </List>
                        
                    </Card>    

                </div>

               

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
        img: state.customer_reducer.img
	}
}

const dispatchToProps = (dispatch) => {

	return {
        fetch_customer_img: (img) => dispatch(fetch_customer_img(img))
    }
}

export default connect(stateToProps, dispatchToProps)(CustomerSettingPage);                 