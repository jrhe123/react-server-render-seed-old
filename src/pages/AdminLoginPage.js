import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

//redux
import {
    set_UserTypeID
} from '../actions/admin_action';

import * as apiManager from  '../helpers/apiManager';
import { opay_url, admin_login } from "../utilities/apiUrl";
import { root_page, admin_page } from '../utilities/urlPath'
import { showSnackbar }  from '../actions/layout_action';

class AdminLoginPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            floatLabelStyle: { fontSize: '19px' },
            inputStyle: { fontSize: '19px'  },
            textFieldStyle: { width: '58%' },
            loginBtnStyle: { marginTop: '19px' },
            paperSize: { height: '60%', width: '50%' },
            username: '',
            usernameEr: '',
            password: '',
            passwordEr: ''
        }
        this.refactor = this.refactor.bind(this);
        this.login = this.login.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
    }

    usernameChange = (e, newString) => {
        this.setState({ username: newString, usernameEr: '' });
    }

    passwordChange = (e, newString) => {
        this.setState({ password: newString, passwordEr: '' });
    }

    login = () => {

        if (!this.state.username || !this.state.password) {

            if (!this.state.username) this.setState({ usernameEr: 'Username is required' });
            if (!this.state.password) this.setState({ passwordEr: 'Password is required' })

            return
        }

        let params = { Params: { LoginKeyword: this.state.username, Password: this.state.password } };

        apiManager.opayApi(opay_url + admin_login,params,false).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                    this.setState({ usernameEr: res.data.Message, passwordEr: res.data.Message })
                } else if (res.data.Confirmation === 'Success') {
                    localStorage.setItem('token', res.data.Token);
                    localStorage.setItem('userTypeID', res.data.Response.UserTypeID)
                    browserHistory.push(`${root_page}${admin_page}`);
                }
            }

        }).catch((err) => {
            console.log('err',err);
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });

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

    componentDidMount() {
        window.addEventListener('resize', this.refactor);
    }


    render() {

        const {
            mainMerchantRegisterPageStyle,
            paperStyle,
            verticalCenter
        } = styles;


        return (
            <MuiThemeProvider>
                <div style={mainMerchantRegisterPageStyle}>

                    <Paper zDepth={3} style={Object.assign({}, this.state.paperSize, paperStyle )}>
                        <div style={verticalCenter}>
                            <TextField floatingLabelText="Username" inputStyle={this.state.inputStyle} onChange={(e, newString) => this.usernameChange(e,newString)}
                                       errorText={this.state.usernameEr} floatingLabelStyle={this.state.floatLabelStyle} style={this.state.textFieldStyle} /><br />
                            <TextField floatingLabelText="Password" type="password" inputStyle={this.state.inputStyle} onChange={(e, newString) => this.passwordChange(e,newString)}
                                       errorText={this.state.passwordEr} floatingLabelStyle={this.state.floatLabelStyle} style={this.state.textFieldStyle} /><br />
                            <RaisedButton label="Login" primary={true} style={this.state.loginBtnStyle} onClick={() => this.login()}/>
                        </div>
                    </Paper>

                </div>
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
    }
}

// const dispatchToProps = (dispatch) => {
//
//     return {
//         set_UserTypeID: (UserTypeID) => dispatch(set_UserTypeID(UserTypeID)),
//     }
// }

export default connect()(AdminLoginPage);