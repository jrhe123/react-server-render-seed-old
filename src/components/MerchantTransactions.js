import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
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

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

// Helpers
import * as formattor from '../helpers/formattor';


class MerchantTransactions extends Component{

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
        this.state = {
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

            transactionType: 'ALL',
            fromDate: null,
            endDate: null
        }
    }

    componentDidMount() {
        this.fetchTransaction(1, 'ALL', null);
    }

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
                    }else if(tran.Type == 'SCAN_QRCODE' || tran.Type == 'SCAN_QRCODE_COMPLETE'){
                        displayType = 'Scan';
                    }else if(tran.Type == 'REFUND'){
                        displayType = 'Refund';
                    }
                    tran.DisplayType = displayType;
                    tran.Status = formattor.capitalStr(tran.Status);
                    tran.CreatedAt = tran.CreatedAt ? formattor.formatDatetime(tran.CreatedAt) : '';
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

        console.log('check: ', tran);

        let updated =  Object.assign([], this.state);
        updated.transactionList[idx].IsOpen = false;
        updated.refundModalOpen = true;

        if(tran.type == 'CNY'){
            tran.DisplayRefundedAmount = (parseFloat(tran.AccountRefundedAmount) / parseFloat(tran.Rate)).toFixed(2)
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


    }
    
    handleRefundClose = () => {
        this.setState({refundModalOpen: false});
    };

    handleDetail = (tran, idx) => {
        console.log(tran);
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
        } = styles;

        return (
            <MuiThemeProvider>
                    <div style={searchContainer}>
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
                                                                        <MenuItem primaryText="Refund" onClick={() => this.handleRefund(tran, idx)}/>
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
                                    style={msgContainer} />
                            </div>
                            <div style={btnControl}>       
                                <RaisedButton label="Refund" 
                                            primary={true}
                                            onClick={() => this.handleConfirmRefund()} />
                            </div> 
                    </Dialog>


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
        height: 100
    },
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default connect()(MerchantTransactions);
