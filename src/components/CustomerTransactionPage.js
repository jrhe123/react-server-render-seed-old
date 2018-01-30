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


class CustomerTransactionPage extends Component{

    constructor(props) {
        super(props);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.fetchTransaction = this.fetchTransaction.bind(this);
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

        apiManager.opayApi(opay_url+'customer/transactions', params, true)
            .then((response) => {
                let res = response.data.Response;
                let { TotalRecords, Transactions } = res;

                for(let tran of Transactions){
                    
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
                localStorage.removeItem('profileImage');
                browserHistory.push(`${root_page}`);
            })
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
                    {/* <div style={searchContainer}>
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
                    </div> */}
                    <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>

                        {
                            this.state.transactionList.length > 0 ?

                            (<Table>
                                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                    <TableRow displayBorder={false}>
                                        <TableHeaderColumn style={tableCellStyle}>Type</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>From</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>To</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Amount</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Remark</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Status</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Timestamp</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                
                                <TableBody displayRowCheckbox={false} showRowHover={true}>
                                        {this.state.transactionList.map((tran, idx)=>(
                                            <TableRow key={tran.GUID} selectable={false}>
                                                <TableRowColumn style={tableCellStyle}>{tran.Type}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{(tran.SenderFirstName ? tran.SenderFirstName : "") + "," + (tran.SenderLastName ? tran.SenderLastName : "")}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{(tran.ReceiverFirstName ? tran.ReceiverFirstName : "") + "," + (tran.ReceiverLastName ? tran.ReceiverLastName : "")}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>${tran.Amount}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{tran.Remark}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{tran.Status}</TableRowColumn>
                                                <TableRowColumn style={tableCellStyle}>{tran.CreatedAt}</TableRowColumn>
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
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default connect()(CustomerTransactionPage);
