import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


// Redux
import { connect } from 'react-redux';
import { hideHeader, showSnackbar }  from '../actions/layout_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

class SettingPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isCreated: false,
            loginKeyword: '',
        }
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
                if(res.IsCreated){
                    this.setState({
                        isCreated: true,
                        loginKeyword: res.LoginKeyword
                    })
                }
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                browserHistory.push(`${root_page}`);
            })
    }

    render() {

        const {
            mainContainer,
            formContainer,
            formControl,
            btnControl
        } = styles;


        const card = this.state.isCreated ? 

            (<Paper zDepth={3} style={{width: 500, height: 320, margin: '0 auto'}}>
                    <p style={{textAlign: 'center', paddingTop: 24, marginBottom: 12, fontSize: '19px'}}>POS machine credential</p>
                    <div style={formControl}>
                        <TextField floatingLabelText="Username" 
                                    defaultValue={this.state.loginKeyword}
                                    />
                    </div>
                    <div style={formControl}>
                        <TextField floatingLabelText="Password" 
                                    type="password"/>
                    </div>     
                    <div style={btnControl}>       
                        <RaisedButton label="Update" 
                                    primary={true} />
                    </div>                
            </Paper>) :

            (<div></div>);

        return (
            <MuiThemeProvider>
                <div style={mainContainer}>
                    <div style={formContainer}>
                        { card }
                    </div>    
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {

    mainContainer: {
        width: '100%',
        height: 'calc(100vh - 64px)',
        display: 'table',
    },

    formContainer: {
        width: 500,
        height: 320,
        display: 'table-cell',
        verticalAlign: 'middle'
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

export default connect()(SettingPage);