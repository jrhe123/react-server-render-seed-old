import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import moment from 'moment';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';

// Component
import Snackbar from 'material-ui/Snackbar';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';


class CustomerRechargePage extends Component{

    constructor(props) {
        super(props);
        this.state = {

            open: false,
            message: '',
            success: false,
            anchorEl: null,
            amount: null,
        }
    }

    componentDidMount(){

        apiManager.opayApi(opay_url+'customer/view', null, true)
            .then((response) => {
                
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

    onFieldChange = (e, value, field) => {
        let updated = Object.assign({}, this.state);
        updated[field] = value;
        this.setState(updated);
    }

    onFieldBlur = (field, e) => {
        let value = e.target.value;
        if(field === 'amount'){
            if(value != null && value != ""){
                value = parseFloat(value).toFixed(2);
            }else{
                value = 0.00;
            }
        }
        let updated = Object.assign({}, this.state);
        updated[field] = value;
        this.setState(updated);

        if(value <= 0){
            this.handleTouchTap(`Amount must be greater than zero`, false);
        }
    }

    renderButton() {
        let total = this.state.amount;
        const opts = {
        env: 'production',
        client: {
            sandbox: 'ARPemHzRC1hnybnVV6chsOO3rcn9OK3F-h8VZ9sBfgYCE2-_a75VX0ukLYEbBkhc3l1fP8z0DCZGKNLC',
            production: 'AVYPy1SGydPBisuq4Jmq9OkQRjNT3fhAPbCg4wAnMN6_kEpACouEbiwo0kS1IT8dhXgJyFFq0DmJfZUF'
        },
        commit: true,
        payment: function createPayment() {
           
            const paymentId = paypal.rest.payment.create(this.props.env, this.props.client, {
                transactions: [{
                    amount: {
                        currency: 'CAD',
                        total,
                    },
                    description: 'Opay recharge service',
                }],
            });

            paymentId.then((res) => {
                console.log("Processed: ", res)
            }).catch((err) => {
                console.error("Error: ", err)
            });

            return paymentId;
        },
        onAuthorize: (data, actions) => actions.payment.execute().then((payment) => {
                
                console.log('payment: ', payment);
                let status = payment.state;
                let tran = payment.transactions[0];
                let total = tran.amount.total;
                let transactionID = tran.related_resources[0].sale.id;

                if(status == "approved" && transactionID){

                    let params = {
                        Params: {
                            PaypalID: transactionID
                        }
                    };
                    apiManager.opayApi(opay_url+'customer/recharge', params, true)
                        .then((response) => {
                            if(response.data.Confirmation === 'Success'){
                                let amount = response.data.Response.OpayTransaction.Amount;
                                this.handleTouchTap(`Recharge Succeed: $${amount} to your account`, true);
                            }else{
                                this.handleTouchTap(`${response.data.Message}`, false);
                            }
                        })
                        .catch((error) => {
                            this.handleTouchTap(`Error: ${error}`, false);
                        })                    
                }else{
                    this.handleTouchTap(`Failed`, false);
                }

            }).catch((err) => {
                console.error("You had an error", { err, items, total });
            }),
        };

        const ReactButton = paypal.Button.driver('react', { React, ReactDOM });
        return (
            <ReactButton
                env={opts.env}
                client={opts.client}
                payment={opts.payment}
                commit={opts.commit}
                onAuthorize={opts.onAuthorize}
            />
        );
    }

    render() {

        const {
            topControlContainer,
            addAddrBtn,
            tableCellStyle,
            infoContainer,
            infoWrapper,
            infoStyle,
            formControl,
            btnControl,
        } = styles;

        return (
            <MuiThemeProvider>
                                   
                <Card style={{width: 'calc(100% - 48px)', height: 300, margin: '24px auto'}}>                    

                    <div style={Object.assign({}, formControl, {paddingTop: 60})}>
                        <TextField 
                            floatingLabelText="Recharge Amount" 
                            value={this.state.amount}
                            onChange={(e, value) => this.onFieldChange(e,value,'amount')}
                            onBlur={this.onFieldBlur.bind(this, 'amount')}
                        />
                    </div>

                    <div style={Object.assign({}, formControl, {marginTop: 48})}>
                        {
                            this.renderButton()
                        }
                    </div>
                  
                </Card>            

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

    topControlContainer: {
        marginTop: 24,
        marginBottom: 36,
        height: 30
    },
    addAddrBtn: {
        float: 'right'
    },
    tableCellStyle: {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        padding: 0,
        textAlign: 'center'
    },
    infoContainer:{
        margin: '0 auto',
        height: 200,
        width: 400,
        display: 'table'
    },
    infoWrapper: {
        width: 400,
        display: 'table-cell',
        verticalAlign: 'middle',
    },
    infoStyle:{
        margin: '0 auto',
        textAlign: 'center',
        fontSize: 19,
        fontWeight: 'bold',
        wordWrap: 'break-word'
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

export default connect()(CustomerRechargePage);