import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Pagination from 'material-ui-pagination';
import moment from 'moment-timezone';
import SearchBar from 'material-ui-search-bar'
import ActionSearch from 'material-ui/svg-icons/action/search';
import ContentClear from 'material-ui/svg-icons/content/clear';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import EditorAttachMoney from 'material-ui/svg-icons/editor/attach-money';

// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// Component
import Snackbar from 'material-ui/Snackbar';

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

// Helpers
import * as formattor from '../helpers/formattor';


class FranchiseTransactions extends Component{

    constructor(props) {
        super(props);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleActionOpen = this.handleActionOpen.bind(this);
        this.handleActionClose = this.handleActionClose.bind(this);
        this.handleDetail = this.handleDetail.bind(this);
        this.handleMerchantChange = this.handleMerchantChange.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
        this.state = {

            zoneType: 'EST',

            open: false,
            message: '',
            success: false,

            Limit: "10",
            Offset: "0",
            totalRecords: 0,
            currentPage: 1,
            transactionList: [],
            display: 10,

            anchorEl: null,
            viewModalOpen: false,
            viewTran: {},
            viewParentTran: {},

            transactionType: 'ALL',
            merchant: '@',
            selectedMerchants: [],
            merchantList: [],
            fromDate: null,
            endDate: null
        }
    }

    componentDidMount() {

        let zoneType = localStorage.getItem('zoneType');
        this.setState({
            zoneType
        })
        this.fetchTransaction(1, 'ALL', null, []);
        this.fetchAssignMerchantList();
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

    fetchAssignMerchantList = () => {

        let params = {
            Params: {
                Limit: '-1',
                Offset: "0",
                Extra: {}
            }
        };
        apiManager.opayApi(opay_url+'franchise/assign_merchant_list', params, true)
            .then((response) => {
                let res = response.data.Response;
                let { MerchantList } = res;
                this.setState({
                    merchantList: MerchantList
                })
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

    exportCSV = () => {

        let transactionField, timerange, merchant;
        transactionField = this.state.transactionType;
        if(this.state.fromDate && this.state.endDate){
            timerange = this.state.fromDate+'|'+this.state.endDate;
        }
        merchant = this.state.selectedMerchants;

        let params = {
            Params: {
                Limit: "-1",
                Offset: "0",
                Extra: {
                    TransactionType: "TransactionType",
                    TransactionField: transactionField,
                    SearchType: "TIMERANGE",
                    SearchField: timerange ? timerange : "",
                    Merchants: merchant
                }
            }
        };

        apiManager.opayCsvApi(opay_url+'franchise/export_transactions', params, true)
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

    handleChangePage = (page) => {
        this.setState({
            currentPage: page
        })

        let timerange = null;
        if(this.state.fromDate && this.state.endDate){
            timerange = this.state.fromDate+'|'+this.state.endDate;
        }
        this.fetchTransaction(page, this.state.transactionType, timerange, this.state.selectedMerchants);
    }

    handleMerchantChange = (event, index, value) => {

        let selectedMerchants = [];
        let isExist = false;
        for(let v of value){
            if(v != "@"){
                selectedMerchants.push(v);
            }else{
                isExist = true;
            }
        }

        if(isExist && value.length > 1){
            for(let i = 0; i < value.length; i++){
                if(value[i] == '@'){
                    value.splice(i, 1);
                }
            }
        }

        this.setState({
            currentPage: 1,
            merchant: value,
            selectedMerchants: selectedMerchants
        })

        if (index === 0) return;

        let timerange = null;
        if(this.state.fromDate && this.state.endDate){
            timerange = this.state.fromDate+'|'+this.state.endDate;
        }
        
        this.fetchTransaction(1, this.state.transactionType, timerange, selectedMerchants);
    }

    handleTransactionTypeChange = (event, index, value) => {
        this.setState({
            currentPage: 1,
            transactionType: value
        })

        let timerange = null;
        if(this.state.fromDate && this.state.endDate){
            timerange = this.state.fromDate+'|'+this.state.endDate;
        }
        this.fetchTransaction(1, value, timerange, this.state.selectedMerchants);
    }

    handleChangeDate = (date, field) => {

        let timerange = null;
        if(field == 'FROM'){
            let formatted = moment(date).tz('America/Toronto').format('YYYY-MM-DD HH:mm:ss');
            this.setState({
                fromDate: formatted
            })
            if(this.state.endDate){
                timerange = formatted+'|'+this.state.endDate;
            }
            this.fetchTransaction(1, this.state.transactionType, timerange, this.state.selectedMerchants);
        }else{
            let formatted = moment(date).tz('America/Toronto').hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            this.setState({
                endDate: formatted
            })
            if(this.state.fromDate){
                timerange = this.state.fromDate+'|'+formatted;
            }
            this.fetchTransaction(1, this.state.transactionType, timerange, this.state.selectedMerchants);
        }
    }

    handleClearDate = () => {
        this.setState({
            fromDate: null,
            endDate: null,
            currentPage: 1,
        })
        this.fetchTransaction(1, this.state.transactionType, null, this.state.selectedMerchants);
    }

    fetchTransaction = (page, transactionField, timerange, merchant) => {
        let offset = (page - 1) * parseInt(this.state.Limit);
        let params = {
            Params: {
                Limit: this.state.Limit,
                Offset: offset.toString(),
                Extra: {
                    TransactionType: "TransactionType",
                    TransactionField: transactionField,
                    SearchType: "TIMERANGE",
                    SearchField: timerange ? timerange : "",
                    Merchants: merchant
                }
            }
        };

        apiManager.opayApi(opay_url+'franchise/transactions', params, true)
            .then((response) => {
                let res = response.data.Response;
                let { TotalRecords, Transactions } = res;
                for(let tran of Transactions){
                    tran.OperatorName = (tran.FirstName ? formattor.capitalStr(tran.FirstName): '')+" "+(tran.LastName ? formattor.capitalStr(tran.LastName): '');
                    tran.DisplayAmount = tran.Currency == 'CNY' ? (parseFloat(tran.Amount) / parseFloat(tran.Rate)).toFixed(2) : (tran.Amount).toFixed(2);
                    tran.IsOpen = false;

                    let displayType = '';
                    if(tran.Type == 'COMPLETE_QRCODE'){
                        displayType = 'QR code';
                    }else if(tran.Type == 'COMPLETE_MERCHANT_QRCODE'){
                        displayType = 'Merchant QR code';
                    }else if(tran.Type == 'SCAN_QRCODE' || tran.Type == 'SCAN_QRCODE_COMPLETE'){
                        displayType = 'Scan';
                    }else if(tran.Type == 'REFUND'){
                        displayType = 'Refund';
                    }
                    tran.DisplayType = displayType;
                    tran.Status = formattor.capitalStr(tran.Status);
                    tran.CreatedAt = tran.CreatedAt ? formattor.formatDatetime(tran.CreatedAt) : '';

                    if(this.state.zoneType == 'PST'){
                        tran.CreatedAt = tran.CreatedAt ? moment(tran.CreatedAt).tz('America/Toronto').subtract('3', 'hours').format('YYYY-MM-DD HH:mm:ss') : ''
                    }
                }

                let updated = Object.assign({}, this.state);
                updated.totalRecords = TotalRecords;
                updated.transactionList = Transactions;
                updated.currentPage = page;
                this.setState(updated);
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

    // Action
    handleActionOpen = (e, tran, idx) => {
        e.preventDefault();
        let anchorEl = e.currentTarget;

        let updated =  Object.assign([], this.state.transactionList);
        updated[idx].IsOpen = true;
        this.setState({
            anchorEl: anchorEl,
            transactionList: updated
        })
    }

    handleActionClose = (idx) => {
        let updated =  Object.assign([], this.state.transactionList);
        updated[idx].IsOpen = false;
        this.setState({
            anchorEl: null,
            transactionList: updated
        })
    }

    handleDetail = (tran, idx) => {

        let params = {
            Params: {
                Platform: tran.Platform,
                GUID: tran.GUID
            }
        };
        apiManager.opayApi(opay_url+'merchant/view_transaction', params, true)
            .then((response) => {

                let res = response.data;
                if(res.Confirmation === 'Success'){
                    let data = res.Response.Transaction;
                    let parent = res.Response.ParentTransaction;

                    data.OperatorName = (data.OperatorFirstName ? formattor.capitalStr(data.OperatorFirstName): '')+", "+(data.OperatorLastName ? formattor.capitalStr(data.OperatorLastName): '');
                    data.RefundUserName = (data.RefundUserFirstName ? formattor.capitalStr(data.RefundUserFirstName): '')+", "+(data.RefundUserLastName ? formattor.capitalStr(data.RefundUserLastName): '');
                    data.DisplayAmount = data.Currency == 'CNY' ? (parseFloat(data.Amount) / parseFloat(data.Rate)).toFixed(2) : (data.Amount).toFixed(2);
                    if(data.Platform == 'ALIPAY'){
                        data.DisplayRefundedAmount = (parseFloat(data.AccountRefundedAmount) / parseFloat(data.Rate)).toFixed(2);
                    }else{
                        data.DisplayRefundedAmount = (parseFloat(data.AccountRefundedAmount) / 100).toFixed(2);
                    }
                    let displayType = '';
                    if(data.Type == 'COMPLETE_QRCODE'){
                        displayType = 'QR code';
                    }else if(data.Type == 'SCAN_QRCODE' || data.Type == 'SCAN_QRCODE_COMPLETE'){
                        displayType = 'Scan';
                    }else if(data.Type == 'REFUND'){
                        displayType = 'Refund';
                    }
                    data.DisplayType = displayType;
                    data.CreatedAt = data.CreatedAt ? formattor.formatDatetime(data.CreatedAt) : '';

                    let updated =  Object.assign([], this.state);
                    updated.transactionList[idx].IsOpen = false;
                    updated.viewModalOpen = true;
                    updated.viewTran = data;
                    updated.viewParentTran = parent;

                    console.log('check: ', data);

                    this.setState(updated);
                }else{
                    this.handleTouchTap(`${res.Message}`, false);
                }
            })
            .catch((error) => {
                this.handleTouchTap(`Error: ${error}`, false);
            })
    }

    handleViewClose =  () => {
        this.setState({viewModalOpen: false});
    }

    render() {

        const {
            tableCellStyle,
            infoContainer,
            infoWrapper,
            infoStyle,
            searchContainer,
            datepicker,
            platformImgStyle,
            formControl,
            btnControl,
            detailPlatform,
            msgContainer,
            exportBtn,
        } = styles;

        return (
            <MuiThemeProvider>

                <div style={exportBtn}>
                    <RaisedButton label="Export" primary={true} onClick={() => this.exportCSV()}/>
                </div>

                <div style={Object.assign({}, searchContainer, {marginLeft: 24, marginRight: 24, marginBottom: 12})}>
                    <SelectField
                        className="ui-search-select"
                        style={{
                            float: 'right',
                            height: '36px',
                            width: '100%',
                            background: '#fff',
                            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
                        }}
                        hintText="Select a merchant.."
                        underlineStyle={{display: 'none'}}
                        multiple={true}
                        value={this.state.merchant}
                        onChange={(event, index, value) => this.handleMerchantChange(event, index, value)}>
                        <MenuItem value="@" label="All Merchants" primaryText="All Merchants" />
                        {this.state.merchantList.map((merchant) => (
                            <MenuItem value={merchant.UserGUID} label={merchant.FirstName +"("+ merchant.AgentID + ")"} primaryText={merchant.FirstName +"("+ merchant.AgentID + ")"} />
                        ))}
                    </SelectField>
                </div>

                <div style={Object.assign({}, searchContainer, {marginTop: 24})}>

                    <RaisedButton icon={ (this.state.fromDate && this.state.endDate) ?
                        <ContentClear />
                        :
                        <ActionSearch />}
                                  style={{float: 'right', marginRight: 24}}
                                  onClick={() => this.handleClearDate()} />
                    <div style={Object.assign({}, datepicker)}>
                        <DatePicker
                            className="ui-date-picker"
                            hintText="End"
                            container="inline"
                            autoOk={true}
                            textFieldStyle={{
                                width: 120,
                                textIndent: 12,
                                marginTop: -4
                            }}
                            style={{
                                height: '36px',
                                background: '#fff',
                                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
                            }}
                            value={ this.state.endDate ? new Date(this.state.endDate) : null }
                            onChange={(event, date) => this.handleChangeDate(date, 'END')} />
                    </div>
                    <div style={Object.assign({}, datepicker)}>
                        <DatePicker
                            className="ui-date-picker"
                            hintText="From"
                            container="inline"
                            autoOk={true}
                            textFieldStyle={{
                                width: 120,
                                textIndent: 12,
                                marginTop: -4
                            }}
                            style={{
                                height: '36px',
                                background: '#fff',
                                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
                            }}
                            value={ this.state.fromDate ? new Date(this.state.fromDate) : null }
                            onChange={(event, date) => this.handleChangeDate(date, 'FROM')} />
                    </div>
                    <SelectField
                        className="ui-search-select"
                        style={{
                            float: 'right',
                            width: 120,
                            height: '36px',
                            background: '#fff',
                            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
                        }}
                        underlineStyle={{display: 'none'}}
                        value={this.state.transactionType}
                        onChange={(event, index, value) => this.handleTransactionTypeChange(event, index, value)}>
                        <MenuItem value="ALL" label="All" primaryText="All" />
                        <MenuItem value="ALIPAY" label="Alipay" primaryText="Alipay" />
                        <MenuItem value="WECHAT" label="Wechat" primaryText="Wechat" />
                    </SelectField>
                    
                </div>
                
                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto', marginTop: 24}}>

                    {
                        this.state.transactionList.length > 0 ?

                            (<Table>
                                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                    <TableRow displayBorder={false}>
                                        <TableHeaderColumn style={tableCellStyle}>Platform</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Operator</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Amount</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Type</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Rate</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Status</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Timestamp</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Action</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>

                                <TableBody displayRowCheckbox={false} showRowHover={true}>
                                    {this.state.transactionList.map((tran, idx)=>(
                                        <TableRow key={tran.GUID} selectable={false}>
                                            <TableRowColumn style={tableCellStyle}>
                                                {
                                                    tran.Platform === 'ALIPAY' ?
                                                        (<img style={platformImgStyle} src="/img/ali_r.png" />)
                                                        :
                                                        (<img style={platformImgStyle} src="/img/wechat_r.png" />)
                                                }
                                            </TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.OperatorName}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>${tran.DisplayAmount}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.DisplayType}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.Rate}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.Status}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.CreatedAt}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>
                                                <FlatButton
                                                    onClick={(e) => this.handleActionOpen(e, tran, idx)}
                                                    icon={<ActionSettings />}
                                                />
                                                <div style={{textAlign: 'center'}}>
                                                    <Popover
                                                        onRequestClose={(e) => this.handleActionClose(idx)}
                                                        open={tran.IsOpen}
                                                        anchorEl={this.state.anchorEl}
                                                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                        animation={PopoverAnimationVertical}>
                                                        <Menu>
                                                            <MenuItem primaryText="Detail" onClick={() => this.handleDetail(tran, idx)}/>
                                                        </Menu>
                                                    </Popover>
                                                </div>
                                            </TableRowColumn>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>)
                            :
                            (<div style={infoContainer}>
                                <div style={infoWrapper}>
                                    <p style={infoStyle}>No Transactions Found</p>
                                </div>
                            </div>)
                    }

                    <Divider />

                    <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>
                        <Pagination
                            total = { Math.ceil(this.state.totalRecords/parseInt(this.state.Limit)) }
                            current = { this.state.currentPage }
                            display = { this.state.display }
                            onChange = { currentPage => this.handleChangePage(currentPage) }
                        />
                    </div>
                </Card>               


                <Dialog
                    className="refund-modal"
                    title="Transaction Detail"
                    modal={false}
                    open={this.state.viewModalOpen}
                    onRequestClose={this.handleViewClose.bind(this)}
                >
                    <div style={{marginBottom: 36}}>
                        <p style={{fontSize: 15, color: '#000'}}>
                            <span style={{color: '#8C8C8C'}}>Platform: </span>
                            {
                                this.state.viewTran.Platform === 'ALIPAY' ?
                                    (<img style={detailPlatform} src="/img/ali_r.png" />)
                                    :
                                    (<img style={detailPlatform} src="/img/wechat_r.png" />)
                            }
                        </p>

                        {
                            this.state.viewTran.Type == 'REFUND' ?
                                (
                                    <p style={{fontSize: 15, color: '#000'}}>
                                        <span style={{color: '#8C8C8C', marginRight: 6}}>Refund Transaction #: </span>
                                        { this.state.viewParentTran.AliTransactionGUID ? this.state.viewParentTran.AliTransactionGUID : this.state.viewParentTran.WechatTransactionGUID }
                                    </p>
                                )
                                :
                                (
                                    <p style={{fontSize: 15, color: '#000'}}>
                                        <span style={{color: '#8C8C8C', marginRight: 6}}>Transaction #: </span>
                                        { this.state.viewTran.GUID }
                                    </p>
                                )
                        }

                        <p style={{fontSize: 15, color: '#000'}}>
                            <span style={{color: '#8C8C8C', marginRight: 6}}>Type: </span>
                            { this.state.viewTran.DisplayType }
                        </p>

                        {
                            this.state.viewTran.Type == 'REFUND' ?
                                (
                                    <div>
                                        <p style={{fontSize: 15, color: '#000'}}>
                                            <span style={{color: '#8C8C8C', marginRight: 6}}>Transaction Operator: </span>
                                            { this.state.viewTran.OperatorName }
                                        </p>
                                        <p style={{fontSize: 15, color: '#000'}}>
                                            <span style={{color: '#8C8C8C', marginRight: 6}}>Refund Operator: </span>
                                            { this.state.viewTran.RefundUserName }
                                        </p>
                                        <p style={{fontSize: 15, color: '#000'}}>
                                            <span style={{color: '#8C8C8C', marginRight: 6}}>Amount: </span>
                                            ${ this.state.viewTran.DisplayAmount }
                                        </p>
                                    </div>
                                )
                                :
                                (
                                    <div>
                                        <p style={{fontSize: 15, color: '#000'}}>
                                            <span style={{color: '#8C8C8C', marginRight: 6}}>Transaction Operator: </span>
                                            { this.state.viewTran.OperatorName }
                                        </p>
                                        <p style={{fontSize: 15, color: '#000'}}>
                                            <span style={{color: '#8C8C8C', marginRight: 6}}>Amount: </span>
                                            ${ this.state.viewTran.DisplayAmount }
                                        </p>
                                        <p style={{fontSize: 15, color: '#000'}}>
                                            <span style={{color: '#8C8C8C', marginRight: 6}}>Refunded amount: </span>
                                            ${ this.state.viewTran.DisplayRefundedAmount }
                                        </p>
                                    </div>
                                )
                        }

                        <p style={{fontSize: 15, color: '#000'}}>
                            <span style={{color: '#8C8C8C', marginRight: 6}}>Rate: </span>
                            { this.state.viewTran.Rate }
                        </p>
                        <p style={{fontSize: 15, color: '#000'}}>
                            <span style={{color: '#8C8C8C', marginRight: 6}}>Status: </span>
                            { this.state.viewTran.Status }
                        </p>
                        <p style={{fontSize: 15, color: '#000'}}>
                            <span style={{color: '#8C8C8C', marginRight: 6}}>Timestamp: </span>
                            { this.state.viewTran.CreatedAt }
                        </p>

                    </div>
                    <div style={btnControl}>
                        <RaisedButton label="Confirm"
                                      primary={true}
                                      onClick={() => this.handleViewClose()} />
                    </div>
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

const styles = {

    tableCellStyle: {
        width: 'calc(100%/9)',
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
    searchContainer:{
        height: 36,
        marginTop: 72
    },
    datepicker:{
        position: 'relative',
        float: 'right',
    },
    platformImgStyle:{
        display: 'block',
        width: 36,
        height: 36,
        margin: '0 auto'
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
    detailPlatform: {
        display: 'inline-block',
        marginLeft: 12,
        width: 48,
        height: 48,
    },
    msgContainer: {
        width: '100%',
        height: 100,
        padding: 12
    },

    exportBtn: {
        float: 'right',
        marginRight: 24,
        marginTop: 18,
        marginBottom: 18
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export default connect()(FranchiseTransactions);
