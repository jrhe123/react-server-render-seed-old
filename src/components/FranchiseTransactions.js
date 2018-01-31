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
        this.fetchTransaction = this.fetchTransaction.bind(this);
        this.handleActionOpen = this.handleActionOpen.bind(this);
        this.handleActionClose = this.handleActionClose.bind(this);
        this.handleRefund = this.handleRefund.bind(this);
        this.handleConfirmRefund = this.handleConfirmRefund.bind(this);
        this.handleRefundClose = this.handleRefundClose.bind(this);
        this.onRefundChange = this.onRefundChange.bind(this);
        this.handleReasonChange = this.handleReasonChange.bind(this);
        this.handleDetail = this.handleDetail.bind(this);
        this.handleMerchantChange = this.handleMerchantChange.bind(this);
        this.fetchMerchantTransaction = this.fetchMerchantTransaction.bind(this);
        this.export = this.export.bind(this);
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
            refundModalOpen: false,
            refundTran: {},
            refundAmount: '',
            refundReason: '',
            refundErrMsg: '',

            viewModalOpen: false,
            viewTran: {},
            viewParentTran: {},

            transactionType: 'ALL',
            merchant: 'MERCHANT',
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
        this.fetchTransaction(1, 'ALL', null);
    }

    export = () => {

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

    handleChangePage = (page) => {
        this.setState({
            currentPage: page
        })

        let timerange = null;
        if(this.state.fromDate && this.state.endDate){
            timerange = this.state.fromDate+'|'+this.state.endDate;
        }
        this.fetchTransaction(page, this.state.transactionType, timerange);
    }

    handleMerchantChange = (event, index, value) => {
        this.setState({
            currentPage: 1,
            merchant: value
        })

        if (index === 0) return;

        let timerange = null;
        if(this.state.fromDate && this.state.endDate){
            timerange = this.state.fromDate+'|'+this.state.endDate;
        }

        this.fetchMerchantTransaction(1, index, timerange);
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
        this.fetchTransaction(1, value, timerange);
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
            this.fetchTransaction(1, this.state.transactionType, timerange);
        }else{
            let formatted = moment(date).tz('America/Toronto').hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            this.setState({
                endDate: formatted
            })
            if(this.state.fromDate){
                timerange = this.state.fromDate+'|'+formatted;
            }
            this.fetchTransaction(1, this.state.transactionType, timerange);
        }
    }

    handleClearDate = () => {
        this.setState({
            fromDate: null,
            endDate: null,
            currentPage: 1,
        })
        this.fetchTransaction(1, this.state.transactionType, null);
    }

    fetchMerchantTransaction = (page, idx, timerange) => {

    }

    fetchTransaction = (page, transactionField, timerange) => {
        let offset = (page - 1) * parseInt(this.state.Limit);
        let params = {
            Params: {
                Limit: this.state.Limit,
                Offset: offset.toString(),
                Extra: {
                    TransactionType: "TransactionType",
                    TransactionField: transactionField,
                    SearchType: "TIMERANGE",
                    SearchField: timerange ? timerange : ""
                }
            }
        };

        apiManager.opayApi(opay_url+'merchant/transaction_list', params, true)
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

    handleRefund = (tran, idx) => {
        let updated =  Object.assign([], this.state);
        updated.transactionList[idx].IsOpen = false;
        updated.refundModalOpen = true;

        if(tran.Platform == 'ALIPAY'){
            tran.DisplayRefundedAmount = (parseFloat(tran.AccountRefundedAmount) / parseFloat(tran.Rate)).toFixed(2);
        }else{
            tran.DisplayRefundedAmount = (parseFloat(tran.AccountRefundedAmount) / 100).toFixed(2);
        }
        updated.refundTran = tran;
        this.setState(updated);
    }

    onRefundChange = (e,value) => {
        e.preventDefault();
        this.setState({
            refundAmount: value
        });
    }

    handleReasonChange = (e) => {
        this.setState({
            refundReason: e.target.value
        });
    }

    onFieldBlur = (field, e) => {

        let value = e.target.value;
        let formatted = parseFloat((' ' + value).slice(1)).toFixed(2);
        if(field === 'refundAmount'){
            if(!value){
                let updated = Object.assign({}, this.state);
                updated.refundErrMsg = "invalid refund amount";
                this.setState(updated);
            }else if(!isNumeric(formatted)){
                let updated = Object.assign({}, this.state);
                updated.refundErrMsg = "invalid refund amount";
                this.setState(updated);
            }else if(formatted > parseFloat(this.state.refundTran.DisplayAmount)){
                let updated = Object.assign({}, this.state);
                updated.refundErrMsg = "refund amount cannot exceed the maximum amount";
                this.setState(updated);
            }else if(formatted == 0){
                let updated = Object.assign({}, this.state);
                updated.refundErrMsg = "refund amount must be greater than 0";
                this.setState(updated);
            }else{
                let updated = Object.assign({}, this.state);
                updated.refundErrMsg = "";
                updated.refundAmount = formatted;
                this.setState(updated);
            }
        }
    }

    handleConfirmRefund = () => {

        let { refundAmount, refundReason } = this.state;
        let { AccountAmount, GUID, Platform, Currency, Rate, Status } = this.state.refundTran;
        if(!refundAmount){
            this.handleTouchTap('Please enter refund amount', false);
            return;
        }else if(!isNumeric(refundAmount)){
            this.handleTouchTap('Refund amount is invalid', false);
            return;
        }else if(refundAmount > this.state.refundTran.DisplayAmount){
            this.handleTouchTap('Refund amount cannot be greater than transaction amount', false);
            return;
        }else if(refundAmount == 0){
            this.handleTouchTap('Refund amount must be greater than 0', false);
            return;
        }else if(!refundReason){
            this.handleTouchTap('Please enter refund reason', false);
            return;
        }else if(!GUID){
            this.handleTouchTap('Invalid transaction', false);
            return;
        }else if(Platform != 'ALIPAY' && Platform != 'WECHAT'){
            this.handleTouchTap('Invalid transaction type', false);
            return;
        }else if(!Rate){
            this.handleTouchTap('Invalid transaction rate', false);
            return;
        }else if(Status != 'Success'){
            this.handleTouchTap('Invalid transaction status', false);
            return;
        }

        let params = null;
        if(Platform === 'ALIPAY'){
            let formattedRefundAmount = (parseFloat(refundAmount) * parseFloat(Rate)).toFixed(2);

            if(Math.abs(AccountAmount - formattedRefundAmount) < 0.1){
                formattedRefundAmount = AccountAmount;
            }
            if(formattedRefundAmount < 0.1){
                formattedRefundAmount = 0.1;
            }
            params = {
                Params: {
                    AliTransactionGUID: GUID,
                    Currency: "CNY",
                    TransCurrency: "CAD",
                    RefundAmount: formattedRefundAmount,
                    Reason: refundReason
                }
            };
        }else{
            params = {
                Params: {
                    WechatTransactionGUID: GUID,
                    Currency: "CAD",
                    TransCurrency: "CNY",
                    RefundAmount: refundAmount,
                    Reason: refundReason
                }
            };
        }

        let refundUrl = Platform === 'ALIPAY' ? 'alipay/merchant_refund' : 'wechat/merchant_refund';
        apiManager.opayApi(opay_url+refundUrl, params, true)
            .then((response) => {

                let res = response.data;
                if(res.Confirmation === 'Success'){

                    let updated = Object.assign({}, this.state);
                    updated.refundModalOpen = false;
                    updated.refundTran = {};
                    updated.refundAmount = '';
                    updated.refundReason = '';
                    this.setState(updated);
                    this.handleTouchTap(`Transaction has been refund`, true);

                    let timerange = null;
                    if(this.state.fromDate && this.state.endDate){
                        timerange = this.state.fromDate+'|'+this.state.endDate;
                    }
                    this.fetchTransaction(this.state.currentPage, this.state.transactionType, timerange);
                }else{
                    this.handleTouchTap(`${res.Message}`, false);
                }
            })
            .catch((error) => {
                this.handleTouchTap(`Error: ${error}`, false);
            })
    }

    handleRefundClose = () => {
        this.setState({refundModalOpen: false});
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
            upperRight,
        } = styles;

        return (
            <MuiThemeProvider>
                <div style={searchContainer}>

                    <RaisedButton label="Export" primary={true} style={upperRight} onclick={() => this.export()}/>

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
                        value={this.state.merchant}
                        onChange={(event, index, value) => this.handleMerchantChange(event, index, value)}>
                        <MenuItem value="MERCHANT" label="MERCHAT" primaryText="MERCHANT" />
                        {this.state.merchantList.map((merchant) => (
                            <MenuItem value={merchant} label={merchant} primaryText={merchant} />
                        ))}
                    </SelectField>
                </div>
                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>

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
                                                            {
                                                                (tran.Type !== 'REFUND' && tran.Status === 'Success') ?
                                                                    (
                                                                        null
                                                                        // <MenuItem primaryText="Refund" onClick={() => this.handleRefund(tran, idx)}/>
                                                                    )
                                                                    :
                                                                    (null)
                                                            }
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
                    title="Refund Transaction"
                    modal={false}
                    open={this.state.refundModalOpen}
                    onRequestClose={this.handleRefundClose.bind(this)}
                >
                    <div style={{marginBottom: 36}}>
                        <p style={{fontSize: 15, color: '#000'}}>
                            <span style={{color: '#8C8C8C'}}>Platform: </span>
                            {
                                this.state.refundTran.Platform === 'ALIPAY' ?
                                    (<img style={detailPlatform} src="/img/ali_r.png" />)
                                    :
                                    (<img style={detailPlatform} src="/img/wechat_r.png" />)
                            }
                        </p>
                        <p style={{fontSize: 15, color: '#000'}}>
                            <span style={{color: '#8C8C8C', marginRight: 6}}>Transaction amount: </span>
                            ${ this.state.refundTran.DisplayAmount }
                        </p>
                        <p style={{fontSize: 15, color: '#000'}}>
                            <span style={{color: '#8C8C8C', marginRight: 6}}>Refunded amount: </span>
                            ${ this.state.refundTran.DisplayRefundedAmount }
                        </p>
                    </div>
                    <Divider style={{marginBottom: 36}} />
                    <div style={{marginBottom: 24}}>
                        <p style={{marginBottom: 0}}>Refund Amount:</p>
                        <div style={{position: 'relative', display: 'inline-block'}}>
                            <EditorAttachMoney style={{position: 'absolute', left: 0, top: 15, width: 20, height: 20}}/>
                            <TextField floatingLabelText=""
                                       style={{paddingLeft: 18}}
                                       value={this.state.refundAmount}
                                       type="number"
                                       onBlur={this.onFieldBlur.bind(this, 'refundAmount')}
                                       errorText={this.state.refundErrMsg}
                                       onChange={(e, value) => this.onRefundChange(e,value)}
                            />
                        </div>
                    </div>
                    <div style={{marginBottom: 24}}>
                        <p style={{marginBottom: 6}}>Refund Reason:</p>
                        <textarea
                            onChange={(e) => this.handleReasonChange(e)}
                            value={this.state.refundReason}
                            placeholder="Please enter refund reason.."
                            style={msgContainer} />
                    </div>
                    <div style={btnControl}>
                        <RaisedButton label="Refund"
                                      primary={true}
                                      onClick={() => this.handleConfirmRefund()} />
                    </div>
                </Dialog>


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
                                      onClick={() => console.log('hit')} />
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
        marginTop: 24
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

    upperRight: {
        float: 'right',
        marginRight: '1vw',

    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export default connect()(FranchiseTransactions);
