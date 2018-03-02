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
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Pagination from 'material-ui-pagination';
import DatePicker from 'material-ui/DatePicker';
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

// Helpers
import * as formattor from '../helpers/formattor';

class MerchantSettlements extends Component{

    constructor(props) {
        super(props);
        this.state = {

            open: false,
            message: '',
            success: false,

            Limit: "10",
            Offset: "0",
            totalRecords: 0,
            currentPage: 1,
            transactionList: [],
            display: 10,

            fromDate: null,
            endDate: null,

            anchorEl: null,           
        }
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

    componentDidMount(){

        const googleGeoSrc = document.createElement('script');
        googleGeoSrc.type="text/javascript";
        googleGeoSrc.setAttribute('src','https://maps.googleapis.com/maps/api/js?key=AIzaSyDqk8Hjqb3BdigfWrTgJ3OhYeKVZG4Z8Qs&libraries=places');
        document.body.appendChild(googleGeoSrc);

        this.fetchTransaction(1, null);
    }

    fetchTransaction = (page, timerange) => {
    
        let offset = (page - 1) * parseInt(this.state.Limit);
        let params = {
            Params: {
                Limit: this.state.Limit,
                Offset: offset.toString(),
                Extra: {
                    SearchType: "TIMERANGE",
                    SearchField: timerange ? timerange : ""
                }
            }
        };

        // console.log('params: ', params);

        apiManager.opayApi(opay_url+'merchant/settle_transactions', params, true)
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
                    tran.CreatedAt = tran.CreatedAt ? moment.tz(tran.CreatedAt, 'America/Toronto').format('YYYY-MM-DD') : '';
                    tran.SettledAt = tran.SettledAt ? moment.tz(tran.SettledAt, 'America/Toronto').format('YYYY-MM-DD') : '';
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

    handleChangePage = (page) => {
        this.setState({
            currentPage: page
        })

        let timerange = null;
        if(this.state.fromDate && this.state.endDate){
            timerange = this.state.fromDate+'|'+this.state.endDate;
        }
        this.fetchTransaction(page, timerange);
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
            this.fetchTransaction(1, timerange);
        }else{
            let formatted = moment(date).tz('America/Toronto').hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            this.setState({
                endDate: formatted
            })
            if(this.state.fromDate){
                timerange = this.state.fromDate+'|'+formatted;
            }
            this.fetchTransaction(1, timerange);
        }
    }

    handleClearDate = () => {
        this.setState({
            fromDate: null,
            endDate: null,
            currentPage: 1,
        })
        this.fetchTransaction(1, null);
    }
     
    handleExport = () => {

        let timerange = null;
        if(this.state.fromDate && this.state.endDate){
            timerange = this.state.fromDate+'|'+this.state.endDate;
        }
        let offset = (this.state.currentPage - 1) * parseInt(this.state.Limit);
        let params = {
            Params: {
                Limit: this.state.Limit,
                Offset: offset.toString(),
                Extra: {
                    SearchType: "TIMERANGE",
                    SearchField: timerange ? timerange : ""
                }
            }
        };

        apiManager.opayApi(opay_url+'merchant/export_settle_transactions', params, true)
            .then((response) => {

                let csvString = response.data;
                var blob = new Blob([csvString]);
                if (window.navigator.msSaveOrOpenBlob)  
                    window.navigator.msSaveBlob(blob, "report.csv");
                else
                {
                    var a = window.document.createElement("a");
                    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
                    a.download = "settlement.csv";
                    document.body.appendChild(a);
                    a.click(); 
                    document.body.removeChild(a);
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


    render() {

        const {
            topControlContainer,
            exportBtn,
            tableCellStyle,
            platformImgStyle,
            infoContainer,
            infoWrapper,
            infoStyle,
            formControl,
            btnControl,
            searchContainer,
            datepicker,
        } = styles;

        return (
            <MuiThemeProvider>
                <div style={topControlContainer}>
                    <RaisedButton label="Export" 
                                    primary={true} 
                                    style={exportBtn}
                                    onClick={() => this.handleExport()} />
                </div> 
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
                                    <TableHeaderColumn style={tableCellStyle}>Transaction Date</TableHeaderColumn>
                                    <TableHeaderColumn style={tableCellStyle}>Settled Date</TableHeaderColumn>
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
                                            <TableRowColumn style={tableCellStyle}>{tran.CreatedAt}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{tran.SettledAt}</TableRowColumn>
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

    topControlContainer: {
        marginTop: 24,
        marginBottom: 24,
        marginRight: 24,
        height: 30
    },
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

}

export default connect()(MerchantSettlements);