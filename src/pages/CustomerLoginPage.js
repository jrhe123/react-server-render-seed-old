import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import validator from 'validator';
import md5 from 'md5';

// Router
import { browserHistory } from 'react-router';
import { root_page, customer_login, customer_dashboard } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

// Component
import Loading from '../components/Loading';
import Snackbar from 'material-ui/Snackbar';


class CustomerLoginPage extends Component{

    constructor(props) {
        super(props);
        this.refactor = this.refactor.bind(this);
        this.login = this.login.bind(this);
        this.state = {

            open: false,
            message: '',
            success: true,

            floatLabelStyle: { fontSize: '19px' },
            inputStyle: { fontSize: '19px'  },
            textFieldStyle: { width: '58%' },
            loginBtnStyle: { marginTop: '19px' },
            paperSize: { height: '60%', width: '50%' },

            isLoading: true,
            loginKeyword: '',
            password: ''
        }
    }

    componentDidMount() {


        let token = localStorage.getItem('token');
        setTimeout(() => {
            if(!token){
                this.setState({
                    isLoading: false,
                })
                const googleTransFun = document.createElement('script');
                const googleTransSrc = document.createElement('script');
                googleTransFun.type="text/javascript";
                googleTransFun.innerHTML="function googleTranslateElementInit() {\n" +
                    "new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');\n" +
                    "}";
                googleTransSrc.type="text/javascript";
                googleTransSrc.setAttribute('src','//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
                document.body.appendChild(googleTransFun);
                document.body.appendChild(googleTransSrc);
                window.addEventListener('resize', this.refactor);
            }else{
                browserHistory.push(`${root_page}${customer_login}`);
            }
        }, 1000);

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

    onFieldChange = (field, e, value) => {
        let updated = Object.assign({}, this.state);
        updated[field] = value;
        this.setState(updated);
    }

    login = () => {

        let { loginKeyword, password } = this.state;

        if(!loginKeyword){
            this.handleTouchTap('Please enter your phone OR email', false);
        }else if(!password){
            this.handleTouchTap('Please enter password', false);
        }else{

            loginKeyword = loginKeyword.trim();
            if(!validator.isEmail(loginKeyword)){

                loginKeyword = loginKeyword.replace(/[+()-\s]/g, "");
                if(loginKeyword.length == 10){
                    loginKeyword = '1' + loginKeyword;
                }
            }else{
                loginKeyword = loginKeyword.toLowerCase();
            }

            let params = {
                Params: {
                    LoginKeyword: loginKeyword,
                    Password: md5(password),
                }
            };
            apiManager.opayApi(opay_url+'customer/login', params, false)
                .then((response) => {

                    if(response.data.Confirmation === 'Success'){
                        localStorage.setItem('token', response.data.Token);
                        localStorage.setItem('userTypeID', response.data.Response.UserTypeID);
                        browserHistory.push(`${root_page}${customer_dashboard}`);
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
            loadingContainer
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
                <div className="merchant_login" style={mainMerchantRegisterPageStyle}>

                    <div id="google_translate_element" style={{float:'right'}}></div>

                    <Paper zDepth={3} style={Object.assign({}, this.state.paperSize, paperStyle )}>

                        <div style={verticalCenter}>

                            <TextField floatingLabelText="Phone/Email"
                                       inputStyle={this.state.inputStyle}
                                       floatingLabelStyle={this.state.floatLabelStyle}
                                       style={this.state.textFieldStyle}
                                       onChange={this.onFieldChange.bind(this, 'loginKeyword')} /><br />
                            <TextField floatingLabelText="Password"
                                       type="password"
                                       inputStyle={this.state.inputStyle}
                                       floatingLabelStyle={this.state.floatLabelStyle}
                                       style={this.state.textFieldStyle}
                                       onChange={this.onFieldChange.bind(this, 'password')} /><br /><br />
                            <RaisedButton label="Login"
                                          primary={true}
                                          style={this.state.loginBtnStyle}
                                          onClick={this.login} /> <br /> <br />              
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

    loadingContainer: {
        width: '100vw',
        height: '100vh',
    }
}

export default CustomerLoginPage;