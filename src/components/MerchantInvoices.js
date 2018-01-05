import React, { Component } from 'react';

// Libraries
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import moment from 'moment';
import Pagination from 'material-ui-pagination';
import SelectField from 'material-ui/SelectField';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import { green400, pinkA400, yellow400, yellow600 } from 'material-ui/styles/colors';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import ActionWatchLater from 'material-ui/svg-icons/action/watch-later';
import validator from 'validator';
import InputMask from 'react-input-mask';
import InputMoment from 'input-moment';


// Component
import Snackbar from 'material-ui/Snackbar';

// Helpers
import * as formattor from '../helpers/formattor';

// Redux
import { connect } from 'react-redux';
import { showSnackbar }  from '../actions/layout_action';

// Router
import { browserHistory } from 'react-router';
import { root_page } from '../utilities/urlPath'

// API
import { opay_url } from '../utilities/apiUrl';
import * as apiManager from '../helpers/apiManager';

class MerchantInvoices extends Component{

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: '',
            success: true,

            Limit: "10",
            Offset: "0",
            totalRecords: 0,
            currentPage: 1,
            invoicesList: [],
            display: 10,

            invoiceModalOpen: false,
            invoiceTypeList: [
                {invoiceType: 'ALIPAY'},
                {invoiceType: 'WECHAT'},
            ],
            newInvoice: {},

            moment: moment(),
            displayMoment: false,

            phoneNumberErrorText: '',
            emailErrorText: '',
            totalFeeErrorText: '',
        }
        this.onFieldChange = this.onFieldChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateSave = this.handleDateSave.bind(this);
        this.handleReasonChange = this.handleReasonChange.bind(this);
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
        this.fetchInvoiceList(this.state.currentPage);
    }

    fetchInvoiceList(page){
        let params = {
            Params: {
                Limit: this.state.Limit,
                Offset: ((page - 1) * this.state.Limit).toString(),
                Extra: {
                    SearchType: "",
                    SearchField: ""
                }
            }
        };

        apiManager.opayApi(opay_url+'merchant/invoice_list', params, true)
            .then((response) => {

                let res = response.data.Response;
                let { Invoices, TotalRecords } = res;
                if(response.data.Confirmation === 'Success'){

                    for(let invoice of Invoices){
                        invoice.PhoneNumber = invoice.PhoneNumber ? formattor.addFormatPhoneNumber(invoice.PhoneNumber.toString()) : null; 
                        invoice.OutTime = invoice.OutTime ? formattor.formatDatetime(invoice.OutTime) : '';
                    }
                    let updated = Object.assign({}, this.state);
                    updated.totalRecords = TotalRecords;
                    updated.invoicesList = Invoices;
                    updated.currentPage = page;
                    this.setState(updated);
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

    handleChangePage = (page) => {
        this.setState({
            currentPage: page
        })        
        this.fetchInvoiceList(page);
    }

    // Modal
    handleOpen = () => {
        this.setState({invoiceModalOpen: true});
    };
    handleClose = () => {
        this.setState({invoiceModalOpen: false});
    };
    handleInvoiceTypeChange = (idx) => {
        let selectedInvoiceType = this.state.invoiceTypeList[idx].invoiceType;
        if(selectedInvoiceType){
            let updated = Object.assign({}, this.state);
            updated.newInvoice['invoiceType'] = selectedInvoiceType;
            this.setState(updated);
        }
    }

    handleDateChange = (moment) => {
        this.setState({
            moment
        })
    }
    handleDateSave = () => {
        this.setState({
            displayMoment: false
        })
    }
    onFieldBlur = (field, e) => {

        let value = e.target.value;
        if(field === 'totalFee'){
            if(!value){
                let updated = Object.assign({}, this.state);
                updated['totalFeeErrorText'] = "Total fee is required.";
                this.setState(updated);
            }else{
                value = parseFloat(value).toFixed(2);
                let updated = Object.assign({}, this.state);
                updated['totalFeeErrorText'] = '';
                updated.newInvoice.totalFee = value;
                this.setState(updated);
            }
        } else if(field === 'phoneNumber') {
            let updated = Object.assign({}, this.state);
            let phoneValue = updated.newInvoice['phoneNumber'];
            phoneValue = phoneValue.replace(/[()-\s]/g,'');

            if(!phoneValue){
                let updated = Object.assign({}, this.state);
                updated['phoneNumberErrorText'] = "Phone is required.";
                this.setState(updated);
            } else if(phoneValue.length < 10) {
                let updated = Object.assign({}, this.state);
                updated['phoneNumberErrorText'] = "Your phone is invalid. Please enter a valid phone.";
                this.setState(updated);
            } else {
                let updated = Object.assign({}, this.state);
                updated['phoneNumberErrorText'] = '';
                this.setState(updated);
            }
        } else if(field === 'email'){
            if(value){          
                if(!validator.isEmail(value)){
                    let updated = Object.assign({}, this.state);
                    updated['emailErrorText'] = "Your email address is invalid. Please enter a valid address.";
                    updated['isValidEmail'] = false;
                    this.setState(updated);
                }else{
                    let updated = Object.assign({}, this.state);
                    updated['emailErrorText'] = '';
                    updated['isValidEmail'] = true;
                    this.setState(updated);
                }
            }else{
                let updated = Object.assign({}, this.state);
                updated['emailErrorText'] = "Email address is required.";
                updated['isValidEmail'] = false;
                this.setState(updated);
            }
        }
    }
    onFieldChange = (e, value, field) => {
        let updated = Object.assign({}, this.state);
        updated.newInvoice[field] = value;
        this.setState(updated);
    }
    onMaskFieldChange = (e, field) => {
        let updated = Object.assign({}, this.state);
        updated.newInvoice[field] = e.target.value;
        this.setState(updated);
    }
    handleReasonChange = (e) => {
        let updated = Object.assign({}, this.state);
        updated.newInvoice['subject'] = e.target.value;
        this.setState(updated);
    }

    addInvoice = () => {

        let dateTime = this.state.moment.format('YYYY-MM-DD HH:mm:ss');
        let { invoiceType, phoneNumber, email, totalFee, subject } = this.state.newInvoice;
        
        if(phoneNumber)
            phoneNumber = phoneNumber.replace(/[()-\s]/g,'');

        if(!dateTime){
            this.handleTouchTap(`Please select a invoice date time`, false);
            return;
        }else if(!invoiceType){
            this.handleTouchTap(`Please select a payment platform`, false);
            return;
        }else if(invoiceType !== 'ALIPAY' && invoiceType !== 'WECHAT'){
            this.handleTouchTap(`Please select a valid payment platform`, false);
            return;
        }else if(!phoneNumber){
            this.handleTouchTap(`Please enter phone number`, false);
            return;
        }else if(phoneNumber.length < 10){
            this.handleTouchTap(`Phone number is invalid`, false);
            return;
        }else if(!email){
            this.handleTouchTap(`Please enter email`, false);
            return;
        }else if(!validator.isEmail(email)){
            this.handleTouchTap(`Email is invalid`, false);
            return;
        }else if(!totalFee){
            this.handleTouchTap(`Please enter total fee`, false);
            return;
        }else if(totalFee < 1){
            this.handleTouchTap(`Total fee must be not less than 1.00`, false);
            return;
        }else if(!subject){
            this.handleTouchTap(`Please enter invoice note`, false);
            return;
        }

        let params = {
            Params: {
                DateTime: dateTime,
                Platform: invoiceType,
                PhoneNumber: phoneNumber,
                Email: email.toLowerCase(),
                TotalFee: totalFee,
                Subject: subject
            }
        };
        apiManager.opayApi(opay_url+'merchant/create_invoice', params, true)
            .then((response) => {
                if(response.data.Confirmation === 'Success'){
                    this.fetchInvoiceList(this.state.currentPage);
                    this.setState({invoiceModalOpen: false});
                    this.handleTouchTap(`${response.data.Message}`, true);
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

    render() {

        const {
            tableCellStyle,
            infoContainer,
            infoWrapper,
            infoStyle,
            platformImgStyle,
            topControlContainer,
            addInvoiceBtn,
            formControl,
            btnControl,
            msgContainer,
        } = styles;

        return (
            <MuiThemeProvider>
                <div style={topControlContainer}>
                    <RaisedButton label="Add" 
                            primary={true} 
                            style={addInvoiceBtn}
                            onClick={() => this.handleOpen()} />
                </div>

                <Card style={{width: 'calc(100% - 48px)', margin: '24px auto'}}>
                    {
                        this.state.invoicesList.length > 0 ?

                        (<div>
                            <Table>
                                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                    <TableRow displayBorder={false}>
                                        <TableHeaderColumn style={tableCellStyle}>Platform</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Phone</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Email</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Total</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Note</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Operator</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Time</TableHeaderColumn>
                                        <TableHeaderColumn style={tableCellStyle}>Status</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
        
                                <TableBody displayRowCheckbox={false} showRowHover={true}>
                                    {this.state.invoicesList.map((invoice, idx)=>(
                                        <TableRow key={invoice.TaskID} selectable={false}>
                                            <TableRowColumn style={tableCellStyle}>
                                                {
                                                    invoice.Platform === 'ALIPAY' ?
                                                    (<img style={platformImgStyle} src="/img/ali_r.png" />)
                                                    :
                                                    (<img style={platformImgStyle} src="/img/wechat_r.png" />)
                                                }
                                            </TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{invoice.PhoneNumber}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{invoice.Email}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>${invoice.TotalFee}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{invoice.Subject}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{invoice.FirstName + ' ' + invoice.LastName}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{invoice.OutTime}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>
                                            {
                                                invoice.IsCompleted ? 
                                                (<ActionCheckCircle color={green400}/>) 
                                                : 
                                                (<ActionWatchLater color={yellow600}/>)
                                            }
                                            </TableRowColumn>
                                        </TableRow>
                                    ))}
                                </TableBody>         
                                                        
                            </Table>
                            <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>  
                                <Divider />
                                <Pagination
                                    total = { Math.ceil(this.state.totalRecords/parseInt(this.state.Limit)) }
                                    current = { this.state.currentPage }
                                    display = { this.state.display }
                                    onChange = { currentPage => this.handleChangePage(currentPage) }
                                />
                            </div>
                        </div>)
                        :
                        (<div style={infoContainer}>
                            <div style={infoWrapper}>
                                <p style={infoStyle}>No Invoice Found</p>
                            </div>
                        </div>)
                    }
                </Card>    

                <Dialog
                    title="Invoice"
                    className="invoice-modal"
                    modal={false}
                    open={this.state.invoiceModalOpen}
                    onRequestClose={this.handleClose.bind(this)}
                >
                            <div style={formControl}>
                                <TextField 
                                    type="text"
                                    floatingLabelText="Select invoice date time" 
                                    value={this.state.moment ? this.state.moment.format('llll') : ''} 
                                    onClick={() => this.setState({displayMoment: !this.state.displayMoment})}
                                    readOnly
                                />
                            </div>

                            {
                                this.state.displayMoment ? 
                                (
                                    <InputMoment
                                        className="moment-select"
                                        moment={this.state.moment}
                                        onChange={this.handleDateChange}
                                        onSave={this.handleDateSave}
                                        minStep={1} // default
                                        hourStep={1} // default
                                        prevMonthIcon="ion-ios-arrow-left" // default
                                        nextMonthIcon="ion-ios-arrow-right" // default
                                        />
                                )
                                :
                                (null)
                            }
                            
                            <div style={formControl}>
                                <SelectField
                                    style={{textAlign: 'left'}}
                                    floatingLabelText="Choose platform.."
                                    value={this.state.newInvoice.invoiceType}
                                    onChange={(e, value) => this.handleInvoiceTypeChange(value)}
                                    >
                                    {this.state.invoiceTypeList.map((item, index) => (
                                        <MenuItem value={item.invoiceType} key={index} primaryText={item.invoiceType}  />
                                    ))}
                                </SelectField>
                            </div>
                            <div style={formControl}>
                                <TextField 
                                    floatingLabelText="Phone number" 
                                    errorText={this.state.phoneNumberErrorText}
                                    value={this.state.newInvoice.phoneNumber}>
                                    <InputMask mask="(999)999-9999"
                                        maskChar=" "
                                        defaultValue={this.state.newInvoice.phoneNumber}
                                        value={this.state.newInvoice.phoneNumber}
                                        onBlur={this.onFieldBlur.bind(this, 'phoneNumber')}
                                        onChange={(e) => this.onMaskFieldChange(e, 'phoneNumber')} />
                                </TextField>    
                            </div>
                            <div style={formControl}>
                                <TextField 
                                    floatingLabelText="Email" 
                                    value={this.state.newInvoice.email}
                                    onBlur={this.onFieldBlur.bind(this, 'email')}
                                    errorText={this.state.emailErrorText}
                                    onChange={(e, value) => this.onFieldChange(e,value,'email')}
                                    />
                            </div>   
                            <div style={formControl}>
                                <TextField 
                                    floatingLabelText="Total fee ($)" 
                                    type="number"
                                    value={this.state.newInvoice.totalFee}
                                    onBlur={this.onFieldBlur.bind(this, 'totalFee')}
                                    errorText={this.state.totalFeeErrorText}
                                    onChange={(e, value) => this.onFieldChange(e,value,'totalFee')}
                                    />
                            </div> 
                            <div style={formControl}>
                                <textarea 
                                    onChange={(e) => this.handleReasonChange(e)}
                                    value={this.state.newInvoice.subject}
                                    placeholder="Please enter your notes.."
                                    style={msgContainer} />
                            </div>
                            <div style={btnControl}>       
                                <RaisedButton label="Add" 
                                            primary={true}
                                            onClick={() => this.addInvoice()} />
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
    platformImgStyle:{
        display: 'block',
        width: 36,
        height: 36,
        margin: '0 auto'
    },
    topControlContainer: {
        marginTop: 24,
        marginBottom: 36,
        height: 30
    },
    addInvoiceBtn: {
        float: 'right'
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
    msgContainer: {
        marginTop:  24,
        width: '60%',
        height: 100,
        padding: 12
    },

}

export default connect()(MerchantInvoices);