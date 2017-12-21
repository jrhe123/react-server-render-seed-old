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
import moment from 'moment-timezone';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
import { greenA400, deepOrangeA400, green400, pinkA400  } from 'material-ui/styles/colors';


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

class MerchantCharts extends Component{

    constructor(props) {
        super(props);
        this.state = {

            open: false,
            message: '',
            success: false,

            userTypeID: null,

            alipayRate: 'loading',
            wechatRate: 'loading',

            merchantRate: 0,

            hasTodayData: false,
            todayData: [],
            totalTodayAli: 0,
            totalTodayWechat: 0,

            hasMonthData: false,
            monthData: [],

            hasAnnualData: false,
            annualData: []
        }
    }
    
    componentDidMount(){
        this.fetch_today();
        this.fetch_monthly();
        this.fetch_annual();
        this.fetch_alipay_reate();
        this.fetch_wechat_rate();
        this.fetch_merchant_rate();

        this.setState({
            userTypeID: localStorage.getItem('userTypeID')
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

    fetch_merchant_rate = () => {
        apiManager.opayApi(opay_url+'merchant/view_merchant_rate', null, true)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){
                    this.setState({
                        merchantRate: response.data.Response.MerchantRate
                    })
                }
            })
            .catch((error) => {
            })
    }

    fetch_alipay_reate = () => {
        let params = {
            Params: {
                Currency: "CAD"
            }
        };
        apiManager.opayApi(opay_url+'alipay/exchange_rate', params, false)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){
                    this.setState({
                        alipayRate: response.data.Response.rate
                    })
                }
            })
            .catch((error) => {
            })
    }

    fetch_wechat_rate = () => {
        let params = {
            Params: {
                Currency: "CAD"
            }
        };
        apiManager.opayApi(opay_url+'wechat/exchange_rate', params, false)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){
                    let rate = response.data.Response.rate;
                    this.setState({
                        wechatRate: rate.substring(0,1)+'.'+rate.substring(1)
                    })
                }
            })
            .catch((error) => {
            })
    }

    fetch_today = () => {
        let today = moment().tz('America/Toronto').format('YYYY-MM-DD')
        let params = {
            Params: {
                Limit: "-1",
                Offset: "0",
                Extra: {
                    TransactionType: "TransactionType",
                    TransactionField: "ALL",
                    SearchType: "TIMERANGE",
                    SearchField: `${today} 00:00:00|${today} 23:59:59`
                }
            }
        };
        this.fetch_data(params, 'todayData');
    }
    process_today = (data) => {
        let ali = [];
        let wechat = [];
        for(let tran of data){
            if(tran.Platform == 'ALIPAY'){
                ali.push(tran);
            }else if(tran.Platform == 'WECHAT'){
                wechat.push(tran);
            }
        }
        // Ali
        let aliObj = {
            name: 'Alipay',
            value: 0
        };
        for(let tran of ali){
            let status = tran.Status;
            if(status == 'SUCCESS'){

                let currentAmount = tran.Amount;
                let rate = tran.Rate;
                let formattedAmount = tran.Currency == 'CNY' ? parseFloat((currentAmount / rate).toFixed(2)) : currentAmount;
                let type = tran.Type;
                if(type != 'REFUND'){
                    aliObj.value += parseFloat(formattedAmount);
                }else{
                    aliObj.value -= parseFloat(formattedAmount);
                }
            }
        }
        if(aliObj.value < 0){
            aliObj.value = 0;
        }else{
            let temp = aliObj.value.toFixed(2);
            aliObj.value = parseFloat(temp);
        }
        // Wechat
        let wechatObj = {
            name: 'Wechat',
            value: 0
        };
        for(let tran of wechat){
            let status = tran.Status;
            if(status == 'SUCCESS'){

                let currentAmount = tran.Amount;
                let rate = tran.Rate;
                let formattedAmount = tran.Currency == 'CNY' ? parseFloat((currentAmount / rate).toFixed(2)) : currentAmount;
                let type = tran.Type;
                if(type != 'REFUND'){
                    wechatObj.value += parseFloat(formattedAmount);
                }else{
                    wechatObj.value -= parseFloat(formattedAmount);
                }
            }
        }
        if(wechatObj.value < 0){
            wechatObj.value = 0;
        }else{
            let temp = wechatObj.value.toFixed(2);
            wechatObj.value = parseFloat(temp);
        }
        let todayData = [
            aliObj,
            wechatObj
        ];
        // Set data
        this.setState({
            totalTodayAli: aliObj.value,
            totalTodayWechat: wechatObj.value,
            hasTodayData: data.length > 0 ? true : false,
            todayData: todayData
        })
    }

    fetch_monthly = () => {
        let from = moment().tz('America/Toronto').subtract(30, 'day').format('YYYY-MM-DD')
        let to = moment().tz('America/Toronto').format('YYYY-MM-DD')
        let params = {
            Params: {
                Limit: "-1",
                Offset: "0",
                Extra: {
                    TransactionType: "TransactionType",
                    TransactionField: "ALL",
                    SearchType: "TIMERANGE",
                    SearchField: `${from} 00:00:00|${to} 23:59:59`
                }
            }
        };
        this.fetch_data(params, 'monthData');
    }

    process_month = (data) => {

        let dateArr = [];
        for(let i = 0; i < 30; i++){
            let key = moment().tz('America/Toronto').subtract(i, 'day').format('YYYY-MM-DD');
            let item = {};
            item[key] = [];
            dateArr.push(item);
        }

        const offset = moment().utcOffset();
        for(let tran of data){
            let found = false;
            let localText = moment.utc(tran.CreatedAt).utcOffset(offset).format("YYYY-MM-DD");
            tran.CreatedAt = localText;
            
            for(let i = 0; i < dateArr.length; i++){
                let myObj = dateArr[i];
                if (`${localText}` in myObj){
                    myObj[localText].push(tran);
                }
            }
        }       
        
        let outArr = [];
        for(let i = 0; i < dateArr.length; i++){

            let item = {};
            for(let key in dateArr[i]){
                item.name = key;
                item.ali = 0;
                item.wechat = 0;
                if (dateArr[i].hasOwnProperty(key)){
                    for(let j = 0; j < dateArr[i][key].length; j++){

                        let status = dateArr[i][key][j].Status;
                        if(status == 'SUCCESS'){
                            let currentAmount = dateArr[i][key][j].Amount;
                            let rate = dateArr[i][key][j].Rate;
                            let formattedAmount = dateArr[i][key][j].Currency == 'CNY' ? parseFloat((currentAmount / rate).toFixed(2)) : currentAmount;
                            let type = dateArr[i][key][j].Type;
                            if(type != 'REFUND'){
                                if(dateArr[i][key][j].Platform === 'ALIPAY'){
                                    item.ali += parseFloat(formattedAmount);
                                }else if(dateArr[i][key][j].Platform === 'WECHAT'){
                                    item.wechat += parseFloat(formattedAmount);
                                }
                            }else{
                                if(dateArr[i][key][j].Platform === 'ALIPAY'){
                                    item.ali -= parseFloat(formattedAmount);
                                }else if(dateArr[i][key][j].Platform === 'WECHAT'){
                                    item.wechat -= parseFloat(formattedAmount);
                                }
                            }
                        }
                    }
                }

                if(item.ali < 0){
                    item.ali = 0;
                }else{
                    let temp = item.ali.toFixed(2);
                    item.ali = parseFloat(temp);
                }

                if(item.wechat < 0){
                    item.wechat = 0;
                }else{
                    let temp = item.wechat.toFixed(2);
                    item.wechat = parseFloat(temp);
                }
            }
            outArr.push(item);
        }
        outArr = outArr.reverse();
        // Set data
        this.setState({
            hasMonthData: true,
            monthData: outArr
        })
    }

    fetch_annual = () => {
        let from = moment().tz('America/Toronto').subtract(12, 'month').format('YYYY-MM-DD')
        let to = moment().tz('America/Toronto').format('YYYY-MM-DD')
        let params = {
            Params: {
                Limit: "-1",
                Offset: "0",
                Extra: {
                    TransactionType: "TransactionType",
                    TransactionField: "ALL",
                    SearchType: "TIMERANGE",
                    SearchField: `${from} 00:00:00|${to} 23:59:59`
                }
            }
        };
        this.fetch_data(params, 'annualData');
    }

    process_annual = (data) => {

        let dateArr = [];
        for(let i = 0; i < 12; i++){
            let key = moment().tz('America/Toronto').subtract(i, 'month').format('YYYY-MM');
            let item = {};
            item[key] = [];
            dateArr.push(item);
        }

        const offset = moment().utcOffset();
        for(let tran of data){
            let found = false;
            let localText = moment.utc(tran.CreatedAt).utcOffset(offset).format("YYYY-MM");
            tran.CreatedAt = localText;
            
            for(let i = 0; i < dateArr.length; i++){
                let myObj = dateArr[i];
                if (`${localText}` in myObj){
                    myObj[localText].push(tran);
                }
            }
        }       
        
        let outArr = [];
        for(let i = 0; i < dateArr.length; i++){

            let item = {};
            for(let key in dateArr[i]){
                item.name = key;
                item.ali = 0;
                item.wechat = 0;
                if (dateArr[i].hasOwnProperty(key)){
                    for(let j = 0; j < dateArr[i][key].length; j++){

                        let status = dateArr[i][key][j].Status;
                        if(status == 'SUCCESS'){
                            let currentAmount = dateArr[i][key][j].Amount;
                            let rate = dateArr[i][key][j].Rate;
                            let formattedAmount = dateArr[i][key][j].Currency == 'CNY' ? parseFloat((currentAmount / rate).toFixed(2)) : currentAmount;
                            let type = dateArr[i][key][j].Type;
                            if(type != 'REFUND'){
                                if(dateArr[i][key][j].Platform === 'ALIPAY'){
                                    item.ali += parseFloat(formattedAmount);
                                }else if(dateArr[i][key][j].Platform === 'WECHAT'){
                                    item.wechat += parseFloat(formattedAmount);
                                }
                            }else{
                                if(dateArr[i][key][j].Platform === 'ALIPAY'){
                                    item.ali -= parseFloat(formattedAmount);
                                }else if(dateArr[i][key][j].Platform === 'WECHAT'){
                                    item.wechat -= parseFloat(formattedAmount);
                                }
                            }
                        }
                    }
                }

                if(item.ali < 0){
                    item.ali = 0;
                }else{
                    let temp = item.ali.toFixed(2);
                    item.ali = parseFloat(temp);
                }

                if(item.wechat < 0){
                    item.wechat = 0;
                }else{
                    let temp = item.wechat.toFixed(2);
                    item.wechat = parseFloat(temp);
                }
            }
            outArr.push(item);
        }
        outArr = outArr.reverse();
        // Set data
        this.setState({
            hasAnnualData: true,
            annualData: outArr
        })
    }

    fetch_data = (params, type) => {

        apiManager.opayApi(opay_url+'merchant/transaction_list', params, true)
            .then((response) => {
                
                if(response.data.Confirmation === 'Success'){
                    let data = response.data.Response.Transactions                    
                    if(type == 'todayData'){
                        this.process_today(data);
                    }
                    if(type == 'monthData'){
                        this.process_month(data);
                    }
                    if(type == 'annualData'){
                        this.process_annual(data);
                    }
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('userTypeID');
                localStorage.removeItem('agentID');
                localStorage.removeItem('loginKeyword');
                localStorage.removeItem('profileImage');
                browserHistory.push(`${root_page}`);
            })
    }

    handleExport = (type) => {

        let from, to;
        if(type == 'TODAY'){
            from = moment().tz('America/Toronto').format('YYYY-MM-DD')
            to = moment().tz('America/Toronto').format('YYYY-MM-DD')
        }else if(type == 'MONTH'){
            from = moment().tz('America/Toronto').subtract(30, 'day').format('YYYY-MM-DD')
            to = moment().tz('America/Toronto').format('YYYY-MM-DD')
        }else if(type == 'ANNUAL'){
            from = moment().tz('America/Toronto').subtract(12, 'month').format('YYYY-MM-DD')
            to = moment().tz('America/Toronto').format('YYYY-MM-DD')
        }
        let params = {
            Params: {
                Limit: "-1",
                Offset: "0",
                Extra: {
                    TransactionType: "TransactionType",
                    TransactionField: "ALL",
                    SearchType: "TIMERANGE",
                    SearchField: `${from} 00:00:00|${to} 23:59:59`
                }
            }
        };
        apiManager.opayCsvApi(opay_url+'merchant/export_transaction_list', params, true)
            .then((response) => {
                
                if(response.data){
                    
                    let csvString = response.data;
                    var blob = new Blob([csvString]);
                    if (window.navigator.msSaveOrOpenBlob)  
                        window.navigator.msSaveBlob(blob, "report.csv");
                    else
                    {
                        var a = window.document.createElement("a");
                        a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
                        a.download = "report.csv";
                        document.body.appendChild(a);
                        a.click(); 
                        document.body.removeChild(a);
                    }
                }else{
                    this.handleTouchTap(`${response.data.Message}`, false);
                }
            })
            .catch((error) => {
                this.handleTouchTap(`Error: ${error}`, false);
            })

    }

    render() {

        const {
            exportBtn,
            tableCellStyle,
            infoContainer,
            infoWrapper,
            infoStyle,
            exRateContainer,
            exRateContent,
            exRate,
            exRateSpan,
            exRateLabel,
            opayFeeContainer,
            feeLabelContainer,
            feeLabel,
            titleLabel,
            contentLabel,
            divider,
            descText
        } = styles;

        return (
            <MuiThemeProvider style={{overflowY: 'auto'}}>
                {
                    this.state.userTypeID == 2 ? 
                    (
                        <Card style={{width: 'calc(100% - 48px)', margin: '24px auto', position: 'relative'}}>
                            <CardHeader
                                title="Today's Opay service fee"
                                subtitle={moment().tz('America/Toronto').format('YYYY-MM-DD')}
                            >
                            </CardHeader>   
                            <Divider />
                                {
                                    this.state.hasTodayData ? 
                                    (
                                        <div>
                                            <div style={opayFeeContainer}>
                                                <div style={feeLabelContainer}>
                                                    <div style={feeLabel}>
                                                        <p style={titleLabel}>Alipay:</p>
                                                        <span style={contentLabel}>$ {this.state.hasTodayData ? this.state.totalTodayAli : 0.00}</span>
                                                    </div>
                                                </div>
                                                <div style={feeLabelContainer}>
                                                    <div style={feeLabel}>
                                                        <p style={titleLabel}>Wechat:</p>
                                                        <span style={contentLabel}>$ {this.state.hasTodayData ? this.state.totalTodayWechat : 0.00}</span>
                                                    </div>
                                                </div>
                                                <div style={feeLabelContainer}>
                                                    <div style={feeLabel}>
                                                        <p style={titleLabel}>Service fee:</p>
                                                        <span style={contentLabel}>-$ 
                                                            {
                                                                this.state.hasTodayData ? 
                                                                    ((parseFloat(this.state.totalTodayWechat) + parseFloat(this.state.totalTodayAli)) * this.state.merchantRate).toFixed(2)
                                                                    : 
                                                                    0.00
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={divider} />
                                                <div style={Object.assign({}, feeLabelContainer, {marginTop: 24})}>
                                                    <div style={feeLabel}>
                                                        <p style={titleLabel}>Total:</p>
                                                        <span style={contentLabel}>$ {this.state.hasTodayData ? 
                                                            (parseFloat(this.state.totalTodayWechat) + parseFloat(this.state.totalTodayAli) - (parseFloat(this.state.totalTodayWechat) + parseFloat(this.state.totalTodayAli)) * this.state.merchantRate).toFixed(2)
                                                            : 
                                                            0.00}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p style={descText}>We will deposit the amount ${this.state.hasTodayData ? 
                                                            (parseFloat(this.state.totalTodayWechat) + parseFloat(this.state.totalTodayAli) - (parseFloat(this.state.totalTodayWechat) + parseFloat(this.state.totalTodayAli)) * this.state.merchantRate).toFixed(2)
                                                            : 
                                                            0.00} to your bank account.</p>
                                        </div>
                                    )
                                    :
                                    (<div style={infoContainer}><div style={infoWrapper}><p style={infoStyle}>No service fee</p></div></div>)
                                }
                        </Card>
                    )
                    :
                    (null)
                }
                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto', position: 'relative'}}>
                    <CardHeader
                        title="Today Transactions"
                        subtitle={moment().tz('America/Toronto').format('YYYY-MM-DD')}
                    >
                        <RaisedButton
                            style={exportBtn}
                            label="Export"
                            primary={true}
                            onClick={() => this.handleExport('TODAY')}
                        />
                    </CardHeader>   
                    <Divider />
                        {
                            this.state.hasTodayData ? 
                            (<PieChart width={800} height={300}>
                                <Pie isAnimationActive={!this.props.isLoading}
                                    data={this.state.todayData} 
                                    cx={130} 
                                    cy={150} 
                                    innerRadius={40}
                                    outerRadius={80} 
                                    fill="#314F76"
                                    dataKey="value"
                                    label
                                >
                                    {
                                        this.state.todayData.map((entry, index) => <Cell fill={(entry.name === 'Alipay' ? '#4295D2' : '#57B538')}/>)
                                    }
                                </Pie>
                                <Tooltip/>
                            </PieChart>)
                            :
                            (<div style={infoContainer}><div style={infoWrapper}><p style={infoStyle}>No transaction found</p></div></div>)
                        }
                        {
                            this.state.hasTodayData ? 
                            (
                                <div style={exRateContainer}>
                                    <div style={exRateContent}>
                                        <div style={exRate}>
                                            <h4 style={{fontWeight: 'bold', marginBottom: 12}}>Transaction Amount</h4>
                                            <p>Alipay: <span style={{fontWeight: 'bold'}}>$ {this.state.hasTodayData ? this.state.totalTodayAli : 0.00}</span></p>
                                            <p>Wechat: <span style={{fontWeight: 'bold'}}>$ {this.state.hasTodayData ? this.state.totalTodayWechat : 0.00}</span></p>
                                        </div>
                                        <div style={exRateSpan}>
                                            <span style={exRateLabel}>Alipay: {this.state.alipayRate}</span>
                                            <span style={exRateLabel}>Wechat: {this.state.wechatRate}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            (null)
                        }
                </Card> 
                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                    <CardHeader
                        title="Daily Transactions of Last 30 Days"
                        subtitle={'From ' + moment().tz('America/Toronto').subtract(30, 'day').format('YYYY-MM-DD') + ' to ' + moment().tz('America/Toronto').format('YYYY-MM-DD')}
                    >  
                        <RaisedButton
                                style={exportBtn}
                                label="Export"
                                primary={true}
                                onClick={() => this.handleExport('MONTH')}
                            /> 
                    </CardHeader>        
                    <Divider style={{marginBottom: 48}} />
                        {
                            this.state.hasMonthData ? 
                            (
                                <BarChart height={400} width={800} data={this.state.monthData}
                                    margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend />
                                <Bar dataKey="ali" fill="#4295D2" />
                                <Bar dataKey="wechat" fill="#57B538" />
                                </BarChart>
                            )
                            :
                            (<div style={infoContainer}><div style={infoWrapper}><p style={infoStyle}>No transaction found</p></div></div>)
                        }
                </Card> 
                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                    <CardHeader
                        title="Monthly Transactions of Last 12 Months"
                        subtitle={'From ' + moment().tz('America/Toronto').subtract(12, 'month').format('YYYY-MM') + ' to ' + moment().tz('America/Toronto').format('YYYY-MM')}
                    >   
                        <RaisedButton
                                    style={exportBtn}
                                    label="Export"
                                    primary={true}
                                    onClick={() => this.handleExport('ANNUAL')}
                                /> 
                    </CardHeader> 
                    <Divider style={{marginBottom: 48}} />
                        {
                            this.state.hasAnnualData ? 
                            (
                                <BarChart height={400} width={800} data={this.state.annualData}
                                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend />
                                <Bar dataKey="ali" fill="#4295D2" />
                                <Bar dataKey="wechat" fill="#57B538" />
                                </BarChart>
                            )
                            :
                            (<div style={infoContainer}><div style={infoWrapper}><p style={infoStyle}>No transaction found</p></div></div>)
                        }
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
    },
    exRateContainer: {
        position: 'absolute',
        right: 0,
        top: 75,
        height: 300,
        width: 'calc(100% - 300px)',
        display: 'table'
    },
    exRateContent:{
        position: 'relative',
        display: 'table-cell',
        verticalAlign: 'middle',
        height: 300,
        width: 'calc(100% - 300px)',
    },
    exRate: {
        margin: '0 auto'
    },
    exRateSpan: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 24,
        overflow: 'hidden'
    },
    exRateLabel: {
        color: '#c9c9c9',
        fontSize: 12,
        height: 24,
        paddingRight: 12
    },
    opayFeeContainer: {
        marginTop: 24,
        height: 180,
        padding: 24,
        paddingRight: 36,
        paddingBottom: 0,
    },
    feeLabelContainer: {
        height: 24,
    },
    feeLabel: {
        float: 'right',
        margin: 0,
        width: 150,
    },
    titleLabel: {
        float: 'left',
        margin: 0
    },
    contentLabel: {
        width: 80,
        fontWeight: 'bold',
        float: 'right',
        textAlign: 'right'
    },
    divider: {
        marginTop: 6,
        marginBottom: 6,
        height: 1,
        width: 190,
        float: 'right',
        borderBottom: '1px solid #c9c9c9',
    },
    descText: {
        textAlign: 'center',
        marginTop: 24,
        color: '#c9c9c9',
        fontSize: 12,
        paddingBottom: 6
    },
    
}

export default connect()(MerchantCharts);