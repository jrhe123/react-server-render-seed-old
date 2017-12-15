// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import isDecimal from 'validator/lib/isDecimal';
import isNumeric from 'validator/lib/isNumeric';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import moment from 'moment';
import Pagination from 'material-ui-pagination';

// helper
import * as formattor from '../helpers/formattor';

// Router
import { root_page } from '../utilities/urlPath'

// API
import { opay_url,
         admin_merchantlist,
         admin_logout,
         admin_active_merchant,
         admin_upate_merchant_rate,
         admin_view_merchant_bank_account,
         admin_update_merchant_bank_account} from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

// Component
import Snackbar from 'material-ui/Snackbar';
import PosList from '../components/PosList';
import SalesList from '../components/SalesList';
import Loading from '../components/Loading';


class AdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {

            docModalOpen: false,
            viewMerchant: {},
            docList: [],

            emailModalOpen: false,
            emailMerchant: {},
            msgContent: '',

            rate: '',
            rateModalOpen: false,
            rateMer: '',
            rateErr: '',

            bankModalOpen: false,
            bankMer: '',
            Account: '',
            AccountErr: '',
            AccountName: '',
            AccountNameErr: '',
            Transit: '',
            TransitErr: '',
            Institution: '',
            InstitutionErr: '',
            InstitutionName: '',
            InstitutionNameErr: '',


            open: false,
            message: '',
            success: false,
            UserTypeID: 6,
            currentPage: 1,
            display: 10,

            showPagination: false, totalPages: 1, boundaryPagesRange: 1,
            siblingPagesRange: 1, hidePreviousAndNextPageLinks: false, start: 0, end: 9,

            Limit: "10",
            Offset: "0",
            serial: '',
            totalRecords: 0,

            hideFirstAndLastPageLinks: false, hideEllipsis: false,
            merListOpenPop: [false],
            merListAnEl: [null],
            merListTitle: ['AgentID', 'Merchant', 'Email', 'Phone', 'Status', 'Sales', 'Rate', 'Action'],
            salesListTitle: ['Name', 'Phone','Email','Status','Action'],
            merList: [],
            UserGUID: '',
            isLoading: true,
            tab: 0,
        }

        this.logout = this.logout.bind(this);
        this.getMerList = this.getMerList.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.active = this.active.bind(this);
        this.onPageChangeFromPagination = this.onPageChangeFromPagination.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.addPos = this.addPos.bind(this);
        this.renderTab = this.renderTab.bind(this);
        this.adminMain = this.adminMain.bind(this);
        this.salesMain = this.salesMain.bind(this);
        this.assignToSales = this.assignToSales.bind(this);
        this.updateRate = this.updateRate.bind(this);
        this.dailyReport = this.dailyReport.bind(this);
        this.rateChange = this.rateChange.bind(this);
        this.viewBankSetting = this.viewBankSetting.bind(this);
    }

    // Snack
    handleTouchTap = (msg, isSuccess) => {
        this.setState({
            open: true,
            message: msg,
            success: isSuccess
        });
    };

    handleChangePage = (page) => {
        this.getMerList(page);
    }

    handleTouchTapClose = () => {
        this.setState({
            open: false,
        });
    };

    adminMain = () => {
        this.setState({ tab: 0 })
    }

    salesMain = () => {
        this.setState({ tab: 2 })
        console.log('salesMain')
    }

    addPos = (idx) => {
        this.setState({ 
            tab: 1, 
            UserGUID: this.state.merList[idx].UserGUID,
            merListOpenPop: [false],
            merListAnEl: [null],
        });
    }

    getMerList = (page) => {

        if (!page) {
            page = 1;
        }
        let offset = (page - 1) * parseInt(this.state.Limit);
        let limit = this.state.Limit;
        let params = { Params: { Limit: limit, Offset: offset.toString(), Extra: {} } };// Limit: -1 means return all results
        apiManager.opayApi(opay_url + admin_merchantlist, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {

                    let list = res.data.Response.Merchants;
                    for(let merchant of list){
                        merchant.PhoneNumber = merchant.PhoneNumber ? formattor.addFormatPhoneNumber(merchant.PhoneNumber.toString()) : null;                        
                        merchant.CreatedAt = merchant.CreatedAt ? moment(merchant.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                        merchant.UpdatedAt = merchant.UpdatedAt ? moment(merchant.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    }
                    this.setState({ merList: list })
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    onPageChangeFromPagination = (newPage) => {

        let start = (newPage-1)*10;
        let end = newPage * 10;
        end = end >= this.state.merList.length ? this.state.merList.length : end;

        let showMerList = this.state.merList.slice(start, end);
        this.setState({ currentPage: newPage, showMerList: showMerList, start: start, end: end });
    }

    logout = () => {

        apiManager.opayApi(opay_url + admin_logout, {}, true).then((res) => {

            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    active = (idx) => {

        let updatedPop = Object.assign([], this.state.merListOpenPop);
        updatedPop[idx] = false;
        this.setState({
            merListOpenPop: updatedPop            
        });

        let params = { Params: { UserGUID: this.state.merList[idx].UserGUID } };
        apiManager.opayApi(opay_url + admin_active_merchant, params, true).then((res) => {
            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    let updated = Object.assign({}, this.state);
                    for (let i = 0;i < this.state.merList.length;i++) {
                        updated.merList[idx].Status = 'ACTIVE';
                    }
                    this.setState(updated);
                    this.handleTouchTap(`Merchant has been updated`, true);
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    }

    handleRequestClose = (idx) => {

        let merListOpenPop = [];

        for (let i = 0;i < this.state.merListOpenPop.length;i++) {
            merListOpenPop[i] = false;
        }
        merListOpenPop[idx] = false;

        this.setState({
            merListOpenPop: merListOpenPop
        })
    }

    handleAction = (event,idx) => {

        event.preventDefault();

        let merListOpenPop = [];
        let merListAnEl = [];

        for (let i = 0;i < this.state.merListOpenPop.length;i++) {
            merListOpenPop[i] = this.state.merListOpenPop[i];
        }

        for (let i = 0;i < this.state.merListAnEl.length;i++) {
            merListAnEl[i] = this.state.merListAnEl[i];
        }

        merListOpenPop[idx] = true;
        merListAnEl[idx] = event.currentTarget;

        this.setState({
            merListOpenPop: merListOpenPop,
            merListAnEl: merListAnEl,
        });
    }

    componentDidMount() {
        this.getMerList(this.state.currentPage);
        let token = localStorage.getItem('token');
        let userTypeId = localStorage.getItem('userTypeID');
        this.setState({ UserTypeID: userTypeId });
        setTimeout(() => {
            if(!token){
                browserHistory.push(`${root_page}`);
            }else{
                this.setState({
                    isLoading: false,
                })
            }
        }, 1000);
    }

    viewDocuments = (idx, merchant) => {

        let params = { Params: { UserGUID: merchant.UserGUID } };
        apiManager.opayApi(opay_url+'admin/view_document_list', params, true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    
                    let updated = Object.assign({}, this.state);
                    updated.merListOpenPop[idx] = false;
                    updated.viewMerchant = merchant;
                    updated.docModalOpen = true;
                    updated.docList = res.data.Response;
                    this.setState(updated);
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            this.handleTouchTap(`Error: ${err}`);
        });
    }

    handleDocClose = () => {
        this.setState({ docModalOpen: false, rateMer: '' });
    }

    viewFile = (doc) => {
        let file = this.state.viewMerchant.UserGUID + '/' + doc;
        window.open(`${opay_url}${file}`);
    }

    handleBackToList = () => {
        this.setState({
            tab: 0,
        })
    }

    onFieldChange = (e, value, field) => {

        if(field === 'New Rate') {
            if(!isDecimal(value)) this.setState({ rate: value, rateErr: 'Rate must be decimal' })
            else this.setState({ rate: value, rateErr: '' })
        } else if(field === 'Account Name') {

        } else if(field === 'Account') {

        } else if(field === 'Transit') {

        } else if(field === 'Institution Name') {

        } else if(field === 'Institution') {

        }

    }

    assignToSales = (idx, merchant) => {
        this.setState({
            tab: 2,
        })
        console.log(this.state.tab);
    }

    dailyReport = () => {

    }

    sendEmail = (idx, merchant) => {
        
        let updated = Object.assign({}, this.state);
        updated.merListOpenPop[idx] = false;
        updated.emailModalOpen = true;
        updated.emailMerchant = merchant;
        
        let defaultMsg = `Hi ${merchant.FirstName},\n\n\n\n`
                        + `Opay Inc.\n ${moment().format('YYYY-MM-DD')}`;
        updated.msgContent = defaultMsg;
        this.setState(updated);
    }

    handleBankSettingClose = () => {
        this.setState({
            bankModalOpen: false,
            bankMer: '',
            Account: '',
            AccountErr: '',
            AccountName: '',
            AccountNameErr: '',
            Transit: '',
            TransitErr: '',
            Institution: '',
            InstitutionErr: '',
            InstitutionName: '',
            InstitutionNameErr: '',
        });
    }

    openBankSetting = (idx, merchant) => {
        this.setState({ bankModalOpen: true, bankMer: merchant })
    }

    viewBankSetting = () => {

        let params = {
            Params: {
                MerchantUserGUID: this.state.bankMer.UserGUID,
            }
        };

        apiManager.opayApi(opay_url + admin_view_merchant_bank_account, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }



    updateRate = (idx, merchant) => {
        this.setState({ rateModalOpen: true, rateMer: merchant });
    }

    handleRateClose = (e) => {
        this.setState({ rateModalOpen: false, rateMer: '', rate: '', rateErr: '' })
    }

    rateChange = () => {

        if(this.state.rateErr) {
            return;
        } else if (!this.state.rate) {
            this.setState({ rateErr: 'Rate must be decimal' });
            return
        } else if(parseFloat(this.state.rate) <= 0.0) {
            this.setState({ rateErr: 'Rate must be positive' });
            return
        }

        this.setState({ rateModalOpen: false });

        let params = {
            Params: {
                UserGUID: this.state.rateMer.UserGUID,
                MerchantRate: this.state.rate
            }
        };

        apiManager.opayApi(opay_url + admin_upate_merchant_rate, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Success') {
                    this.getMerList(this.state.currentPage);
                    this.handleTouchTap(`Success`, true);
                }else{
                    this.handleTouchTap(`Error: ${res.data.Message}`, false);
                }
            }
        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    handleEmailChange = (e) => {
        let updated = Object.assign({}, this.state.emailMerchant);
        updated.Email = e.target.value;
        this.setState({
            emailMerchant: updated
        })
    }

    handleMsgChange = (e) => {
        this.setState({
            msgContent: e.target.value
        });
    }

    handleEmailClose = () => {
        this.setState({
            emailModalOpen: false
        });
    }

    sendMessage = () => {
        let email = this.state.emailMerchant.Email;
        let content = this.state.msgContent;
        if(!validateEmail(email)){
            this.handleTouchTap(`Email address is invalid`, false);
            return;
        }
        if(!content){
            this.handleTouchTap(`Content cannot be empty`, false);
            return;
        }

        let params = { 
            Params: { 
                Email: email,
                Content: content 
            } 
        };
        apiManager.opayApi(opay_url+'admin/send_email', params, true)
            .then((res) => {
                if (res.data) {
                    if (res.data.Confirmation === 'Success') {
                        this.handleEmailClose();
                        this.handleTouchTap(`Email has been sent`, true);
                    }else{
                        this.handleTouchTap(`Error: ${res.data.Message}`, false);
                    }
                }
            })
            .catch((err) => {
                this.handleTouchTap(`Error: ${err}`);
            });
    }

    renderTab(tab) {

        const {
            tableCellStyle,
            docLink,
            msgContainer,
            btnControl,
            formControl,
        } = styles;

        switch(tab) {
            case 1:
                return (
                    <PosList UserGUID={this.state.UserGUID} OnBack={() => this.handleBackToList()} />
                );
            case 2:
                return (
                    <SalesList OnBack={() => this.handleBackToList()} />
                )
            default:
                return (

                        <div>
                            <Table>
                                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                    <TableRow>
                                        {this.state.merListTitle.map((item) => (
                                            <TableHeaderColumn style={tableCellStyle}>{item}</TableHeaderColumn>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false} showRowHover={true}>
                                    {this.state.merList.slice(this.state.start,this.state.end).map((msg, idx)=>(
                                        <TableRow key={idx} selectable={false}>
                                            <TableRowColumn style={tableCellStyle}>{msg.AgentID}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{msg.FirstName}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{msg.Email}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{msg.PhoneNumber}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{msg.Status === 'ACTIVE' ? 'ACTIVE' : 'PENDING'}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{'Sales'}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{msg.MerchantRate}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}><div style={{textAlign: 'center'}}>
                                                <RaisedButton
                                                    onClick={(e) => this.handleAction(e, idx)}
                                                    secondary={msg.Status !== 'ACTIVE'}
                                                    label='ACTION'
                                                />
                                                <Popover
                                                    onRequestClose={(e, idx) => this.handleRequestClose(idx)}
                                                    open={this.state.merListOpenPop[idx]}
                                                    anchorEl={this.state.merListAnEl[idx]}
                                                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                    animation={PopoverAnimationVertical}>
                                                    <Menu>
                                                        {
                                                            (msg.Status === 'ACTIVE') ?
                                                            (
                                                                <MenuItem primaryText="Add POS" onClick={() => this.addPos(idx)}/>
                                                            )
                                                            :
                                                            (
                                                                <MenuItem primaryText="Active" onClick={() => this.active(idx)}/>
                                                            )
                                                        }
                                                        <MenuItem primaryText="Set bank account info" onClick={() => this.openBankSetting(idx, msg)}/>
                                                        <MenuItem primaryText="Update Rate" onClick={() => this.updateRate(idx, msg)}/>
                                                        <MenuItem primaryText="Assign To Sales" onClick={() => this.assignToSales(idx, msg)}/>
                                                        <MenuItem primaryText="Documents" onClick={() => this.viewDocuments(idx, msg)}/>
                                                        <MenuItem primaryText="Email" onClick={() => this.sendEmail(idx, msg)}/>
                                                    </Menu>
                                                </Popover>
                                            </div></TableRowColumn>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>
                                <Pagination
                                    total={Math.ceil(this.state.totalRecords / parseInt(this.state.Limit))}
                                    current={this.state.currentPage}
                                    display={this.state.display}
                                    onChange={currentPage => this.handleChangePage(currentPage)}
                                />
                            </div>

                            <div style={{textAlign: 'center'}}>
                                <RaisedButton label="Add Merchant" primary={true} onClick={this.openDialog}/><br/>
                            </div>

                            <Dialog title="Set Bank Account Info" modal={false} open={this.state.bankModalOpen}
                                    onRequestClose={this.handleBankSettingClose.bind(this)}>
                                <div>
                                    <div style={formControl}>
                                        <TextField floatingLabelText="Account Name" errorText={this.state.AccountNameErr}
                                                   onChange={(e, value) => this.onFieldChange(e, value, 'Account Name')}/><br/>
                                        <TextField floatingLabelText="Account" errorText={this.state.AccountErr}
                                                   onChange={(e, value) => this.onFieldChange(e, value, 'Account')}/><br/>
                                        <TextField floatingLabelText="Transit" errorText={this.state.TransitErr}
                                                   onChange={(e, value) => this.onFieldChange(e, value, 'Transit')}/><br/>
                                        <TextField floatingLabelText="Institution Name" errorText={this.state.InstitutionNameErr}
                                                   onChange={(e, value) => this.onFieldChange(e, value, 'Institution Name')}/><br/>
                                        <TextField floatingLabelText="Institution" errorText={this.state.InstitutionErr}
                                                   onChange={(e, value) => this.onFieldChange(e, value, 'Institution')}/>
                                    </div>
                                    <div style={btnControl}>
                                        <RaisedButton label="Add" primary={true} />
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog title="Change Rate" modal={false} open={this.state.rateModalOpen}
                                    onRequestClose={this.handleRateClose.bind(this)}>
                                <div>
                                    <div style={formControl}>
                                        <TextField floatingLabelText="New Rate" errorText={this.state.rateErr}
                                                   onChange={(e, value) => this.onFieldChange(e, value, 'New Rate')}/><br/>
                                    </div>
                                    <div style={btnControl}>
                                        <RaisedButton label="Confirm" primary={true} onClick={this.rateChange}/>
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog title="Documentation" modal={false} open={this.state.docModalOpen}
                                onRequestClose={this.handleDocClose.bind(this)}>
                                <div style={{marginBottom: 24}}>
                                    {
                                        this.state.docList.map((doc, idx) => (
                                            <li>
                                                <a style={docLink}
                                                    onClick={() => this.viewFile(doc)}>{doc}</a>
                                            </li>
                                        ))
                                    }
                                </div>
                            </Dialog>

                            <Dialog title="Email" modal={false} open={this.state.emailModalOpen}
                                onRequestClose={this.handleEmailClose.bind(this)}>
                                <div style={{marginBottom: 36}}>
                                    <p style={{fontSize: 17, fontWeight: 'bold', color: '#000'}}>Information:</p>
                                    <p style={{fontSize: 15, color: '#000'}}>
                                        <span style={{color: '#8C8C8C'}}>Merchant:&nbsp;</span> 
                                        {this.state.emailMerchant.FirstName ? this.state.emailMerchant.FirstName : ''} 
                                    </p>
                                    <p style={{fontSize: 15, color: '#000'}}>
                                        <span style={{color: '#8C8C8C'}}>Sending to:&nbsp;</span> 
                                    </p>
                                    <input style={{width: '100%', borderBottom: '1px solid #c9c9c9'}} 
                                            type="text" 
                                            onChange={(e) => this.handleEmailChange(e)}
                                            value={this.state.emailMerchant.Email ? this.state.emailMerchant.Email : ''} />
                                </div>
                                <div style={{marginBottom: 24}}>
                                    <textarea 
                                        onChange={(e) => this.handleMsgChange(e)}
                                        value={this.state.msgContent}
                                        style={msgContainer} />
                                </div>
                                <div style={btnControl}>       
                                    <RaisedButton label="Send" 
                                                primary={true}
                                                onClick={() => this.sendMessage()} />
                                </div> 
                            </Dialog>
                        </div>
                );
        }
    }

    render() {

        const {
            mainPageStyle,
            drawerContainer,
            contentContainer,
            loadingContainer,
            drawerItem
        } = styles;

        if(this.state.isLoading){
            return (
                <div style={loadingContainer}>
                    <Loading />
                </div>
            )
        }

        return (
            <MuiThemeProvider>
                <div style={mainPageStyle}>

                    <div style={drawerContainer}>
                        <Drawer open={true} width={150}>
                            <MenuItem style={drawerItem} primaryText="Merchants" onClick={this.adminMain} />
                            { this.state.UserTypeID === '1' ? <MenuItem style={drawerItem} primaryText="Sales" onClick={this.salesMain} /> : ''}
                            <MenuItem style={drawerItem} primaryText="Report" onClick={this.dailyReport} />
                            <MenuItem style={drawerItem} primaryText="Log out" onClick={this.logout} />
                        </Drawer>
                    </div>

                    <div style={contentContainer}>
                        {this.renderTab(this.state.tab)}
                    </div>

                </div>
                <Snackbar 
                    open={this.state.open} 
                    message={this.state.message}
                    autoHideDuration={3000} 
                    onRequestClose={this.handleTouchTapClose}
                    bodyStyle={{backgroundColor: this.state.success ? green400 : pinkA400, textAlign: 'center' }}
                    />
            </MuiThemeProvider>
        )
    }

}


const styles = {

    mainPageStyle: {
        width: '100vw',
        height: '100vh',
    },

    tableCellStyle: {
        width: '12.8%',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        textAlign: 'center'
    },

    drawerContainer: {
        display: 'inline-block',
        float: 'left',
        width: '150px',
        height: '100vh',
    },

    drawerItem: {
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 6
    },

    contentContainer: {
        display: 'inline-block',
        float: 'left',
        width: 'calc(100% - 150px)',
        height: '100vh',
    },

    loadingContainer: {
        width: '100vw',
        height: '100vh',
    },

    docLink: {
        textDecoration: 'underline',
        cursor: 'pointer'
    },

    formControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 12,
        marginBottom: 12
    },

    msgContainer: {
        width: '100%',
        height: 200
    },

    btnControl: {
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 36,
        marginBottom: 12
    },

}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const stateToProps = (state) => {

    return {
        UserTypeID: state.admin_reducer.UserTypeID,
    }
}

export default connect(stateToProps)(AdminPage);