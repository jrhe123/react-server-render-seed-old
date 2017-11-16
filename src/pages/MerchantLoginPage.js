import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

// Redux
import { connect } from 'react-redux';
import { hideHeader, showSnackbar }  from '../actions/layout_action';

// Router
import { browserHistory } from 'react-router';
import { root_page, merchant_admin, merchant_register } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

class MerchantLoginPage extends Component{

    constructor(props) {
        super(props);
        this.refactor = this.refactor.bind(this);
        this.login = this.login.bind(this);
        this.SignUp = this.SignUp.bind(this);
        this.state = {
            floatLabelStyle: { fontSize: '19px' },
            inputStyle: { fontSize: '19px'  },
            textFieldStyle: { width: '58%' },
            loginBtnStyle: { marginTop: '19px' },
            paperSize: { height: '60%', width: '50%' },

            agentID: '',
            userName: '',
            password: ''
        }
        this.props.dispatch(hideHeader(true));
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        if(token){
            browserHistory.push(`${root_page}${merchant_admin}`);
        }else{
            window.addEventListener('resize', this.refactor);
        }
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

    SignUp = () => {
        browserHistory.push(`${root_page}${merchant_register}`);
    }

    onFieldChange = (field, e, value) => {
        let updated = Object.assign({}, this.state);
        updated[field] = value;
        this.setState(updated);
    }

    login = () => {

        if(!this.state.agentID){
            this.props.dispatch(showSnackbar('Please enter your agentID', false));
        }else if(!this.state.userName){
            this.props.dispatch(showSnackbar('Please enter your userName', false));
        }else if(!this.state.password){
            this.props.dispatch(showSnackbar('Please enter password', false));
        }else{
            let params = {
                Params: {
                    AgentID: this.state.agentID,
                    LoginKeyword: this.state.userName,
                    Password: this.state.password
                }
            };
            apiManager.opayApi(opay_url+'user/login', params, false)
                .then((response) => {
                    if(response.data.Confirmation === 'Success'){
                        localStorage.setItem('token', response.data.Token);
                        localStorage.setItem('userTypeID', response.data.Response.UserTypeID);
                        browserHistory.push(`${root_page}${merchant_admin}`);
                    }else{
                        this.props.dispatch(showSnackbar(`${response.data.Message}`, false));
                    }
                })
                .catch((error) => {
                    this.props.dispatch(showSnackbar(`Error: ${error}`, false));
                })
        }
    }

    render() {

        const {
            mainMerchantRegisterPageStyle,
            paperStyle,
            verticalCenter
        } = styles;

        return (
            <MuiThemeProvider>
                <div className="merchant_login" style={mainMerchantRegisterPageStyle}>

                    <Paper zDepth={3} style={Object.assign({}, this.state.paperSize, paperStyle )}>
                        <div style={verticalCenter}>
                            <TextField floatingLabelText="Agent ID" 
                                        inputStyle={this.state.inputStyle}
                                        floatingLabelStyle={this.state.floatLabelStyle} 
                                        style={this.state.textFieldStyle}
                                        onChange={this.onFieldChange.bind(this, 'agentID')} /><br />
                            <TextField floatingLabelText="Username" 
                                        inputStyle={this.state.inputStyle}
                                        floatingLabelStyle={this.state.floatLabelStyle} 
                                        style={this.state.textFieldStyle}
                                        onChange={this.onFieldChange.bind(this, 'userName')} /><br />
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
                            <FlatButton label="Sign Up" 
                                        onClick={this.SignUp} />
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

export default connect()(MerchantLoginPage);