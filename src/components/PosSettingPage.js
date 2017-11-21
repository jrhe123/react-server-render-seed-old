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
import ActionLock from 'material-ui/svg-icons/action/lock';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';

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


class PosSettingPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            open: false,
            message: '',
            success: true,

            userName: '',
            password: ''
        }
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    componentDidMount(){

        let params = {
            Params: {
                AgentID: localStorage.getItem('agentID')
            }
        };
        apiManager.opayApi(opay_url+'merchant/view_pos_login', params, true)
            .then((response) => {
                let res = response.data.Response;
                let posLogin = {
                    isCreated: res.IsCreated,
                    loginKeyword: res.LoginKeyword
                };
                this.props.fetch_merchant_pos_login(posLogin);
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
        if(nextProps.posLogin.isCreated){
            this.setState({
                userName: nextProps.posLogin.loginKeyword
            })
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

    // Modal
    handleOpen = () => {
        this.setState({modalOpen: true});
    };

    handleClose = () => {
        this.setState({modalOpen: false});
    };

    onFieldChange = (e, value, field) => {
        let updated = Object.assign({}, this.state);
        updated[field] = value;
        this.setState(updated);
    }

    handleCreatePosLogin = () => {

        let agentID = localStorage.getItem('agentID');
        if(!agentID){
            this.handleTouchTap('AgentID not found. Please login again', false);
        }else if(!this.state.userName){
            this.handleTouchTap('Please enter your user name', false);
        }else if(!this.state.password){
            this.handleTouchTap('Please enter password', false);
        }else{
            let params = {
                Params: {
                    AgentID: agentID,
                    UserName: this.state.userName,
                    Password: this.state.password
                }
            };
            apiManager.opayApi(opay_url+'merchant/create_pos_login', params, true)
                .then((response) => {
                    if(response.data.Confirmation === 'Success'){

                        let res = response.data.Response;
                        let posLogin = {
                            isCreated: true,
                            loginKeyword: res.LoginKeyword
                        };
                        this.props.fetch_merchant_pos_login(posLogin);  
                        this.handleTouchTap(`POS login has been created`, true);
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

    handleUpdatePosLogin = () => {

        let agentID = localStorage.getItem('agentID');
        if(!agentID){
            this.handleTouchTap('AgentID not found. Please login again', false);
        }else if(!this.state.userName){
            this.handleTouchTap('Please enter your user name', false);
        }else if(!this.state.password){
            this.handleTouchTap('Please enter password', false);
        }else{
            let params = {
                Params: {
                    AgentID: agentID,
                    UserName: this.state.userName,
                    Password: this.state.password
                }
            };
            apiManager.opayApi(opay_url+'merchant/update_pos_login', params, true)
                .then((response) => {
                    if(response.data.Confirmation === 'Success'){

                        let res = response.data.Response;
                        let posLogin = {
                            isCreated: true,
                            loginKeyword: res.LoginKeyword
                        };
                        this.props.fetch_merchant_pos_login(posLogin);  
                        this.handleTouchTap(`POS login has been updated`, true);
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

    render() {

        const {
            mainContainer,
            formControl,
            btnControl
        } = styles;

        if(!this.props.posLogin){
            return null;
        }

        const card = (this.props.posLogin.isCreated) ? 

        (
            <div>
                <div style={formControl}>
                    <TextField floatingLabelText="Username" 
                                defaultValue={this.props.posLogin.loginKeyword ? this.props.posLogin.loginKeyword : ''}
                                onChange={(e, value) => this.onFieldChange(e,value,'userName')}
                                />
                </div>
                <div style={formControl}>
                    <TextField floatingLabelText="Password" 
                                onChange={(e, value) => this.onFieldChange(e,value,'password')}
                                type="password"/>
                </div>     
                <div style={btnControl}>       
                    <RaisedButton label="Update" 
                                primary={true}
                                onClick={this.handleUpdatePosLogin} />
                </div>    
            </div>                
        ): 

        (
            <div>
                <div style={formControl}>
                    <TextField floatingLabelText="Username" 
                                onChange={(e, value) => this.onFieldChange(e,value,'userName')}
                                />
                </div>
                <div style={formControl}>
                    <TextField floatingLabelText="Password" 
                                onChange={(e, value) => this.onFieldChange(e,value,'password')}
                                type="password"/>
                </div>     
                <div style={btnControl}>       
                    <RaisedButton label="Create" 
                                primary={true}
                                onClick={this.handleCreatePosLogin} />
                </div>   
            </div>                 
        );

        return (
            <MuiThemeProvider>
                <div style={mainContainer}>

                    <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                        <CardHeader
                            title={this.props.posLogin.loginKeyword ? this.props.posLogin.loginKeyword : 'Not Assigned'}
                            subtitle="POS machines login credential"
                            avatar="/img/avatar.png"
                        />
                        <Divider />
                        <CardActions>
                            <FlatButton label={this.props.posLogin.isCreated ? 'Edit Credential' : 'Create Credential'}
                                        onClick={this.handleOpen.bind(this)}
                                        primary={true} 
                                        icon={<ActionLock />} />
                        </CardActions>
                        
                    </Card>   
                </div>

                <Dialog
                    title="Pos Credential"
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={this.handleClose.bind(this)}
                >
                     { card }
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

// 

const styles = {

    mainContainer: {
        width: '100%',
        height: 'calc(100vh - 64px)',
    },

    formContainer: {
        width: "calc(100% - 48px)",
        margin: '24px auto',
        height: 320,
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
    }

}

const stateToProps = (state) => {

	return {
		posLogin: state.merchant_reducer.posLogin,
	}
}

const dispatchToProps = (dispatch) => {

	return {
		fetch_merchant_pos_login: (posLogin) => dispatch(fetch_merchant_pos_login(posLogin))
	}
}

export default connect(stateToProps, dispatchToProps)(PosSettingPage);