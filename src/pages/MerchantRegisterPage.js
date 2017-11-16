import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import * as apiManager from '../helpers/apiManager';

class MerchantRegisterPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            floatLabelStyle: { fontSize: '19px' },
            inputStyle: { fontSize: '19px'  },
            textFieldStyle: { width: '58%' },
            loginBtnStyle: { marginTop: '19px' },
            paperSize: { height: '60%', width: '50%' }
        }
        this.refactor = this.refactor.bind(this);
        this.SignUp = this.SignUp.bind(this);
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

    }

    componentDidMount() {
        window.addEventListener('resize', this.refactor);
        let params = {
            "Params": {
                "Limit": "-1",
                "Offset": "0",
                "Extra": {
                    "SearchType": "DATE",
                    "SearchField": "TODAY"
                }
            }
        }
        apiManager.opayApi('http://localhost:3000/merchant/transaction_list', params, true)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
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
                            <TextField floatingLabelText="Username" inputStyle={this.state.inputStyle}
                                       floatingLabelStyle={this.state.floatLabelStyle} style={this.state.textFieldStyle} /><br />
                            <TextField floatingLabelText="Email" inputStyle={this.state.inputStyle}
                                       floatingLabelStyle={this.state.floatLabelStyle} style={this.state.textFieldStyle} /><br /><br />
                            <RaisedButton label="Sign Up" primary={true} style={this.state.loginBtnStyle} /> <br /> <br />

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

export default MerchantRegisterPage;