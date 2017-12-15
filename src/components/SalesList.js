import React, { Component } from 'react';

// Libraries
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Pagination from 'material-ui-pagination';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import moment from 'moment';

// Router
import {
    root_page,
    admin_page
} from '../utilities/urlPath'

// Components
import Snackbar from 'material-ui/Snackbar';

// API
import { opay_url,
         admin_sales_list,
         admin_remove_sales,
         admin_create_sales } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class SalesList extends Component {

    constructor(props) {
        super(props);
        this.state = {

            open: false,
            message: '',
            success: false,

            firstName: '',
            lastName: '',
            Email: '',
            firstNameErr: '',
            lastNameErr: '',
            EmailErr: '',

            Limit: "10",
            Offset: "0",
            serial: '',
            totalRecords: 0,
            currentPage: 1,
            tableField: [ 'Name', 'Email', 'Status', 'CreatedAt', 'Action'],
            salesList: [],
            display: 10,
            UserTypeID: 6,
            delSaleIdx: '',
            modalOpen: false,
            deleteSalesModalOpen: false,
        }
        this.openDialog = this.openDialog.bind(this);
        this.getSalesList = this.getSalesList.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.addSales = this.addSales.bind(this);
        this.deleteSales = this.deleteSales.bind(this);
        this.handleClose = this.handleClose.bind(this)
        this.confirmDelSales = this.confirmDelSales.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    componentDidMount() {
        let userTypeId = localStorage.getItem('userTypeID');
        this.setState({ UserTypeID: userTypeId });
        this.getSalesList();
    }

    // Snack
    handleTouchTap = (msg, isSuccess) => {
        this.setState({
            open: true,
            message: msg,
            success: isSuccess
        });
    }

    handleTouchTapClose = () => {
        this.setState({
            open: false,
        });
    }

    openDialog = () => {
        this.setState({ modalOpen: true });
    }

    handleChangePage = (page) => {
        this.getSalesList(page);
    }

    addSales = () => {

        if(this.state.firstNameErr || this.state.lastNameErr, this.state.EmailErr) return;

        if (!this.state.firstName || !this.state.lastName || !this.state.Email) {

            if (!this.state.firstName) {
                this.setState({ firstNameErr: 'First Name is required' })
            }

            if (!this.state.lastName) {
                this.setState({ lastNameErr: 'Last Name is required' })
            }

            if (!this.state.Email) {
                this.setState({ EmailErr: 'Email is required' })
            }

            return;
        }

        let params = { Params: {
                FirstName: this.state.firstName,
                LastName: this.state.lastName,
                Email: this.state.Email,
            }
        };

        apiManager.opayApi(opay_url + admin_create_sales, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                    this.handleTouchTap(`${res.data.Message}`, false);
                } else if (res.data.Confirmation === 'Success') {
                    this.setState({ modalOpen: false });
                    this.handleTouchTap(`Sales has been added`, true);
                    this.getSalesList(this.state.currentPage);// may have problem when the current page contains 10 item
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    getSalesList = (page) => {

        if (!page) {
            page = 1;
        }
        let offset = (page - 1) * parseInt(this.state.Limit);
        let limit = this.state.Limit;

        let params = {
            Params: {
                Limit: limit,
                Offset: offset.toString(),
                Extra: {}
            }
        };// Limit: -1 means return all results

        apiManager.opayApi(opay_url + admin_sales_list, params, true).then((res) => {

            if (res.data) {

                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {
                    let salesList = res.data.Response.SalesList;
                    for (let sales of salesList) {
                        sales.CreatedAt = sales.CreatedAt ? moment(sales.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    }
                    this.setState({
                        currentPage: page,
                        salesList: salesList,
                        totalRecords: res.data.Response.TotalRecords
                    });
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    deleteSales = (e, idx) => {
        this.setState({deleteSalesModalOpen: true, delSaleIdx: idx});
    }

    confirmDelSales = () => {
        let idx = this.state.delSaleIdx;
        let length = this.state.salesList.length;
        if((length === 0) || (idx >= length)) return;
        let params = {
            Params: {
                SalesUserGUID: this.state.salesList[idx].UserGUID
            }
        };

        apiManager.opayApi(opay_url + admin_remove_sales, params, true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                    this.handleTouchTap(`${res.data.Message}`, false);
                } else if (res.data.Confirmation === 'Success') {
                    this.getSalesList(this.state.page)
                    this.setState({ deleteSalesModalOpen: false });
                    this.handleTouchTap(`Sales has been deleted`, true);
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    onFieldChange = (e, value, field) => {

        if(field === 'First Name') {
            this.setState({ firstName: value, firstNameErr: '' })
        } else if (field === 'Last Name') {
            this.setState({ lastName: value, lastNameErr: '' })
        } else if (field === 'Email') {
            this.setState({ Email: value })
            if(!validateEmail(value)) {
                this.setState({ EmailErr: 'Please input valid email' });
            } else {
                this.setState({ EmailErr: '' });
            }
        }
    }

    handleClose = () => {
        this.setState({modalOpen: false, deleteSalesModalOpen: false, delSaleIdx:''});
    }

    backToList = () => {
        this.props.OnBack();
    }

    render(){
        const {
            tableCellStyle,
            formControl,
            btnControl,
            backBtn
        } = styles;

        const actions = [
            <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
            <FlatButton label="Yes" primary={true} onClick={this.confirmDelSales} />,
        ];

        return (
            <MuiThemeProvider>
                <div>
                    <div>
                        <Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    {this.state.tableField.map((item) => (
                                        <TableHeaderColumn style={tableCellStyle}>{item}</TableHeaderColumn>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {this.state.salesList.map((sales, idx) => (
                                    <TableRow key={idx} selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{sales.FirstName + ' ' + sales.LastName}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{sales.Email}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{sales.Status}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{sales.CreatedAt}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{<div style={{textAlign: 'center'}}>
                                            <RaisedButton
                                                onClick={(e) => this.deleteSales(e, idx)}
                                                secondary={true}
                                                label='Delete'
                                            /></div>}</TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>
                        <Pagination
                            total={Math.ceil(this.state.totalRecords / parseInt(this.state.Limit))}
                            current={this.state.currentPage}
                            display={this.state.display}
                            onChange={currentPage => this.handleChangePage(currentPage)}
                        />
                    </div>

                    <div style={{textAlign: 'center'}}>
                        <RaisedButton label="Add Sales" primary={true} onClick={this.openDialog}/><br/>
                        <a style={backBtn} onClick={() => this.backToList()}>Back</a>
                    </div>

                    <Dialog title="Add Sales" modal={false} open={this.state.modalOpen}
                            onRequestClose={this.handleClose.bind(this)}>
                        <div>
                            <div style={formControl}>
                                <TextField floatingLabelText="First Name" errorText={this.state.firstNameErr}
                                           onChange={(e, value) => this.onFieldChange(e, value, 'First Name')}/><br/>
                                <TextField floatingLabelText="Last Name" errorText={this.state.lastNameErr}
                                           onChange={(e, value) => this.onFieldChange(e, value, 'Last Name')}/><br/>
                                <TextField floatingLabelText="Email" errorText={this.state.EmailErr}
                                           onChange={(e, value) => this.onFieldChange(e, value, 'Email')}/>
                            </div>
                            <div style={btnControl}>
                                <RaisedButton label="Add" primary={true} onClick={this.addSales}/>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog title="Delete Sales" modal={false} open={this.state.deleteSalesModalOpen}
                            actions={actions} onRequestClose={this.handleClose.bind(this)}>
                        Are you sure?
                    </Dialog>

                </div>
                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    autoHideDuration={3000}
                    onRequestClose={this.handleTouchTapClose}
                    bodyStyle={{backgroundColor: this.state.success ? green400 : pinkA400, textAlign: 'center'}}
                />
            </MuiThemeProvider>
        )

    }


}

const styles = {

    tableCellStyle: {
        width: '12.8%',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        textAlign: 'center'
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

    backBtn: {
        display: 'block',
        marginTop: 12,
        fontSize: 14,
        cursor: 'pointer',
        textDecoration: 'underline'
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default SalesList;