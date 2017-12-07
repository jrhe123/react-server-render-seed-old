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
import { PieChart, Pie, Legend, Tooltip, Cell } from 'Recharts';
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

            hasTodayData: false,
            todayData: [],

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
            let currentAmount = tran.Amount;
            let rate = tran.Rate;
            let formattedAmount = tran.Currency == 'CNY' ? parseFloat((currentAmount / rate).toFixed(2)) : currentAmount;
            let type = tran.Type;
            if(type != 'REFUND'){
                aliObj.value += formattedAmount;
            }else{
                aliObj.value -= formattedAmount;
            }
        }
        // Wechat
        let wechatObj = {
            name: 'Wechat',
            value: 0
        };
        for(let tran of wechat){
            let currentAmount = tran.Amount;
            let rate = tran.Rate;
            let formattedAmount = tran.Currency == 'CNY' ? parseFloat((currentAmount / rate).toFixed(2)) : currentAmount;
            let type = tran.Type;
            if(type != 'REFUND'){
                wechatObj.value += formattedAmount;
            }else{
                wechatObj.value -= formattedAmount;
            }
        }
        let todayData = [
            aliObj,
            wechatObj
        ];
        // Set data
        this.setState({
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

                        let currentAmount = dateArr[i][key][j].Amount;
                        let rate = dateArr[i][key][j].Rate;
                        let formattedAmount = dateArr[i][key][j].Currency == 'CNY' ? parseFloat((currentAmount / rate).toFixed(2)) : currentAmount;
                        let type = dateArr[i][key][j].Type;
                        if(type != 'REFUND'){
                            if(dateArr[i][key][j].Platform === 'ALIPAY'){
                                item.ali += formattedAmount;
                            }else if(dateArr[i][key][j].Platform === 'WECHAT'){
                                item.wechat += formattedAmount;
                            }
                        }else{
                            if(dateArr[i][key][j].Platform === 'ALIPAY'){
                                item.ali -= formattedAmount;
                            }else if(dateArr[i][key][j].Platform === 'WECHAT'){
                                item.wechat -= formattedAmount;
                            }
                        }
                    }
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

                        let currentAmount = dateArr[i][key][j].Amount;
                        let rate = dateArr[i][key][j].Rate;
                        let formattedAmount = dateArr[i][key][j].Currency == 'CNY' ? parseFloat((currentAmount / rate).toFixed(2)) : currentAmount;
                        let type = dateArr[i][key][j].Type;
                        if(type != 'REFUND'){
                            if(dateArr[i][key][j].Platform === 'ALIPAY'){
                                item.ali += formattedAmount;
                            }else if(dateArr[i][key][j].Platform === 'WECHAT'){
                                item.wechat += formattedAmount;
                            }
                        }else{
                            if(dateArr[i][key][j].Platform === 'ALIPAY'){
                                item.ali -= formattedAmount;
                            }else if(dateArr[i][key][j].Platform === 'WECHAT'){
                                item.wechat -= formattedAmount;
                            }
                        }
                    }
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
        } = styles;

        const data = [
            {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
            {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
            {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
            {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
            {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
            {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
            {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
        ];

        return (
            <MuiThemeProvider style={{overflowY: 'auto'}}>
                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
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
                                    cx={200} 
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
    }


}

export default connect()(MerchantCharts);