import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { Card, CardHeader } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import moment from 'moment';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'Recharts';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
import { greenA400, deepOrangeA400, green400, pinkA400  } from 'material-ui/styles/colors';
import cron from 'cron';

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

const colors = scaleOrdinal(schemeCategory10).range();
const interval = 5;

class MerchantMonitor extends Component{

    constructor(props) {
        super(props);
        this.state = {

            open: false,
            message: '',
            success: false,

            timeLine: []
        }
        this.crontask = this.cronTask();
    }
    
    componentDidMount(){
        this.crontask.start();
    }

    componentWillUnmount(){
        this.crontask.stop();
    }

    cronTask = () => {
        return new cron.CronJob({
            cronTime: `*/${interval} * * * * *`,
            onTick: () => {
                this.fetchLiveTransaction();
            },
            start: false,
            timeZone: 'America/Toronto'
        });
    }

    fetchLiveTransaction = () => {

        let from = moment().subtract(interval, 'second').format('YYYY-MM-DD HH:mm:ss');
        let to = moment().format('YYYY-MM-DD HH:mm:ss');
        let params = {
            Params: {
                Limit: "-1",
                Offset: "0",
                Extra: {
                    TransactionType: "TransactionType",
                    TransactionField: "ALL",
                    SearchType: "TIMERANGE",
                    SearchField: `${from}|${to}`
                }
            }
        };

        apiManager.opayApi(opay_url+'merchant/transaction_list', params, true)
            .then((response) => {
                
                if(response.data.Confirmation === 'Success'){
                    let updated = Object.assign([], this.state.timeLine);
                    updated.push(
                        {name: moment().format('HH:mm:ss'), number: response.data.Response.TotalRecords}
                    );
                    if(updated.length > 20){
                        updated.shift();
                    }
                    this.setState({
                        timeLine: updated
                    });
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
            })
            .catch((error) => {
                this.handleTouchTap(`Error: ${error}`, false);
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

    render() {

        const {
            exportBtn,
            tableCellStyle,
            infoContainer,
            infoWrapper,
            infoStyle,
        } = styles;

        return (
            <MuiThemeProvider style={{overflowY: 'auto'}}>
                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                    <CardHeader
                        title="Live Transactions"
                        subtitle={moment().format('YYYY-MM-DD')}
                    >
                    </CardHeader>   
                    <Divider style={{marginBottom: 48}}/>

                    <AreaChart width={1000} height={200} data={this.state.timeLine} syncId="anyId"
                        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Area type='monotone' dataKey='number' stroke='#1C3656' fill='#314F76' />
                    </AreaChart>
                    
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
    exportBtn: {
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
    }


}

export default connect()(MerchantMonitor);