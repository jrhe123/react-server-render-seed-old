import React, { Component } from 'react';

// Libraries
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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
import { opay_url, admin_franchise_assign_merchant_list, admin_remove_merchant_from_franchise } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class ViewMerchant extends Component {

    constructor(props) {
        super(props);
        this.state = {

            open: false,
            message: '',
            success: false,

            UserGUID: props.UserGUID,
            Limit: "10",
            Offset: "0",
            idx: '',
            totalRecords: 0,
            currentPage: 1,
            tableField: ['Name', 'Email', 'Status', 'Action'],
            merList: [],
            display: 10,
            modalOpen: false,
        }
        this.openDialog = this.openDialog.bind(this);
        this.getMerList = this.getMerList.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.delMer = this.delMer.bind(this);
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

    openDialog = (idx) => {
        this.setState({ modalOpen: true, idx: idx });
    }

    handleChangePage = (page) => {
        this.getMerList(page);
    }

    delMer = () => {

       // console.log(this.state.merList);


        let params = {
            Params: {
                UserGUID: this.state.merList[this.state.idx].UserGUID,
            }
        };

        apiManager.opayApi(opay_url + admin_remove_merchant_from_franchise, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                    this.handleTouchTap(`${res.data.Message}`, false);
                } else if (res.data.Confirmation === 'Success') {
                    this.setState({ modalOpen: false });
                    this.handleTouchTap(`Merchant has been released`, true);
                    this.getMerList(this.state.page);// may have problem when the current page contains 10 item
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    getMerList = (page) => {

        if(!page){
            page = 1;
        }
        let offset = (page - 1) * parseInt(this.state.Limit);
        let limit = this.state.Limit;
        let UserGUID = this.state.UserGUID;

        let params = { Params: {
            UserGUID: UserGUID,
            Limit: limit,
            Offset: offset.toString(),
            Extra: { SearchType: '', SearchField: '' } }
        };// Limit: -1 means return all results

        apiManager.opayApi(opay_url + admin_franchise_assign_merchant_list, params,true).then((res) => {

            if (res.data) {

                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {
                    let merList = res.data.Response.MerchantList;
                    for(let mer of merList){
                        mer.CreatedAt = mer.CreatedAt ? moment(mer.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                        mer.UpdatedAt = mer.UpdatedAt ? moment(mer.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    }
                    this.setState({ currentPage: page, merList: merList, totalRecords: res.data.Response.TotalRecords });
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    handleClose = () => {
        this.setState({modalOpen: false});
    }

    componentDidMount() {
        this.getMerList();
    }

    backToList = () => {
        this.props.OnBack();
    }

    render() {

        const {
            tableCellStyle,
            btnControl,
            backBtn
        } = styles;

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
                                {this.state.merList.map((mer, idx)=>(
                                    <TableRow key={mer.UserGUID} selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{mer.FirstName + " " + mer.LastName}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{mer.Email}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{mer.Status}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{<div style={{textAlign: 'center'}}>
                                            <RaisedButton onClick={(e) => this.openDialog(idx)}
                                                          secondary={true} label='Release'
                                            /></div>}
                                        </TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>
                        <Pagination
                            total = { Math.ceil(this.state.totalRecords/parseInt(this.state.Limit)) }
                            current = { this.state.currentPage }
                            display = { this.state.display }
                            onChange = { currentPage => this.handleChangePage(currentPage) }
                        />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <a style={backBtn} onClick={() => this.backToList()}>Back</a>
                    </div>

                    <Dialog title="Release Merchant" modal={false} open={this.state.modalOpen}
                            onRequestClose={this.handleClose.bind(this)}
                    >
                        <div>
                            <div style={btnControl}>
                                <RaisedButton label="Yes" secondary={true} onClick={this.delMer} />
                            </div>
                        </div>
                    </Dialog>

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

export default ViewMerchant;