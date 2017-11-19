import React, { Component } from 'react';

// Libaries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import validator from 'validator';
import { green400, pinkA400 } from 'material-ui/styles/colors';

// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

// Component
import Snackbar from 'material-ui/Snackbar';


class MerchantRegisterPage extends Component{

    constructor(props) {

        super(props);
        this.refactor = this.refactor.bind(this);
        this.state = {

            open: false,
            message: '',
            success: true,

            floatLabelStyle: { fontSize: '19px' },
            inputStyle: { fontSize: '19px'  },
            textFieldStyle: { width: '58%' },
            loginBtnStyle: { marginTop: '19px' },
            paperSize: { height: '60%', width: '50%' },

            btnTxt: 'Sign Up',
            isResend: false,
            merchantName: '',
            merchantNameErrorText: '',
            email: '',
            emailErrorText: '',
            isValidEmail: false
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.refactor);
    }

    refactor = () => {
        const width = window.innerWidth;
        if(width <= 414) {
            this.setState({ floatLabelStyle: { fontSize: '12px' } });
            this.setState({ inputStyle: { fontSize: '12px' } });
            this.setState({ textFieldStyle: { width: '66%' } });
            this.setState({ loginBtnStyle: {marginTop: '2px'}});
            this.setState({ paperSize: { height: '70%', width: '68%' } });
        } else if(width <= 768) {
            this.setState({ floatLabelStyle: { fontSize: '15px' } });
            this.setState({ inputStyle: { fontSize: '15px' } });
            this.setState({ textFieldStyle: { width: '78%' } });
            this.setState({ loginBtnStyle: {marginTop: '4px'}});
            this.setState({ paperSize: { height: '60%', width: '50%' } });
        } else {
            this.setState({floatLabelStyle: {fontSize: '19px'}});
            this.setState({inputStyle: {fontSize: '19px'}});
            this.setState({textFieldStyle: {width: '58%'}});
            this.setState({loginBtnStyle: {marginTop: '19px'}});
            this.setState({ paperSize: { height: '60%', width: '50%' } });
        }
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


    onFieldBlur = (field, e) => {

        let value = e.target.value;
        if(field === 'merchantName'){
            if(!value){
                let updated = Object.assign({}, this.state);
                updated['merchantNameErrorText'] = "Merchant name is required.";
                this.setState(updated);
            }else{
                let updated = Object.assign({}, this.state);
                updated['merchantNameErrorText'] = '';
                this.setState(updated);
            }
        }else if(field === 'email'){
            if(value){          
                if(!validator.isEmail(value)){
                    let updated = Object.assign({}, this.state);
                    updated['emailErrorText'] = "Your email address is invalid. Please enter a valid address.";
                    updated['isValidEmail'] = false;
                    this.setState(updated);
                }else{
                    let updated = Object.assign({}, this.state);
                    updated['emailErrorText'] = '';
                    updated['isValidEmail'] = true;
                    this.setState(updated);
                }
            }else{
                let updated = Object.assign({}, this.state);
                updated['emailErrorText'] = "Email address is required.";
                updated['isValidEmail'] = false;
                this.setState(updated);
            }
        }
    }

    onFieldChange = (field, e, value) => {
        let updated = Object.assign({}, this.state);
        updated[field] = value;
        this.setState(updated);
    }

    handlerSubmit = () => {
        if(!this.state.merchantName){
            this.handleTouchTap('Please enter your merchant name', false);
        }else if(!this.state.email){
            this.handleTouchTap('Please enter your email', false);
        }else if(!this.state.isValidEmail){
            this.handleTouchTap('Invalid email address', false);
        }else{
            let params = {
                Params: {
                    MerchantName: this.state.merchantName,
                    Email: this.state.email
                }
            };
            apiManager.opayApi(opay_url+'merchant/send_register_email', params, false)
                .then((response) => {
                    if(response.data.Confirmation === 'Success'){

                        let updated = Object.assign({}, this.state);
                        updated['btnTxt'] = 'Resend';
                        updated['isResend'] = true;
                        this.setState(updated);

                        this.handleTouchTap('Registration form has been sent to your email', true);
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
            mainMerchantRegisterPageStyle,
            paperStyle,
            verticalCenter,
            resendStyle
        } = styles;

        const resendText = (this.state.isResend) 
            ? <p style={resendStyle}>Didn't receive email? Resend it.</p> : null;
        return (
            <MuiThemeProvider>
                <div style={mainMerchantRegisterPageStyle}>
                    <Paper zDepth={3} style={Object.assign({}, this.state.paperSize, paperStyle )}>
                       
                        <div style={verticalCenter}>
                            <TextField floatingLabelText="Merchant name" 
                                        inputStyle={this.state.inputStyle}
                                        floatingLabelStyle={this.state.floatLabelStyle} 
                                        style={this.state.textFieldStyle}
                                        onBlur={this.onFieldBlur.bind(this, 'merchantName')}
                                        errorText={this.state.merchantNameErrorText}
                                        onChange={this.onFieldChange.bind(this, 'merchantName')} /><br />
                            <TextField floatingLabelText="Email" 
                                        inputStyle={this.state.inputStyle}
                                        floatingLabelStyle={this.state.floatLabelStyle} 
                                        style={this.state.textFieldStyle}
                                        onBlur={this.onFieldBlur.bind(this, 'email')}
                                        errorText={this.state.emailErrorText}
                                        onChange={this.onFieldChange.bind(this, 'email')} /><br /><br />
                            <RaisedButton label={this.state.btnTxt} 
                                            primary={true} 
                                            style={this.state.loginBtnStyle}
                                            onClick={() => this.handlerSubmit()} /> <br />
                            { resendText }
                        </div>

                    </Paper>
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

    mainMerchantRegisterPageStyle: {
        width: '100vw',
        height: '100vh',
    },

    paperStyle: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        textAlign: 'center'
    },

    signUpBtn: {
        marginTop: '10px',
    },

    verticalCenter: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)'
    },

    resendStyle: {
        marginTop: 12,
        color: '#B2B2B2',
    }

}

export default connect()(MerchantRegisterPage);