import React, { Component } from 'react';

// Libraries
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Pagination from 'material-ui-pagination';
import { green400, pinkA400 } from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import Card from 'material-ui/Card/Card';
import moment from 'moment';

// Router
import {
    root_page,
} from '../utilities/urlPath';

// Components
import AddMerchant from './AddMerchant';
import ViewMerchant from './ViewMerchant'


// API
import { opay_url,
    admin_franchise_list,
    admin_create_franchise } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';

class Franchise extends Component {

    constructor(props) {
        super(props);
        this.state = {

            open: false,
            message: '',
            success: false,
            franListOpenPop: [false],
            franListAnEl: [null],

            firstName: '',
            lastName: '',
            Email: '',
            firstNameErr: '',
            lastNameErr: '',
            EmailErr: '',

            tab: 0,
            Limit: "10",
            Offset: "0",
            serial: '',
            totalRecords: 0,
            currentPage: 1,
            tableField: [ 'AgentID', 'Name', 'Email', 'Status', 'Action'],
            franchiseList: [],
            display: 10,
            UserTypeID: 6,
            modalOpen: false,
            addFranchiseModalOpen: false,
            UserGUID: ''
        }
        this.openDialog = this.openDialog.bind(this);
        this.getFranchiseList = this.getFranchiseList.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleBackToList = this.handleBackToList.bind(this);
        this.addFranchise = this.addFranchise.bind(this);
        this.action = this.action.bind(this);
        this.addMerchant = this.addMerchant.bind(this);
        this.viewMerchant = this.viewMerchant.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.renderTab = this.renderTab.bind(this);
    }

    componentDidMount() {
        let userTypeId = localStorage.getItem('userTypeID');
        this.setState({ UserTypeID: userTypeId });
        this.getFranchiseList();
    }

    handleBackToList = () => {
        this.setState({
            tab: 0,
        })
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
        this.getFranchiseList(page);
    }

    handleRequestClose = (idx) => {

        let franListOpenPop = [];

        for (let i = 0;i < this.state.franListOpenPop.length;i++) {
            franListOpenPop[i] = false;
        }

        this.setState({
            franListOpenPop: franListOpenPop
        })
    }

    addMerchant = (idx) => {

        let updated = Object.assign({}, this.state);
        updated.franListOpenPop[idx] = false;
        updated.tab = 1;
        updated.UserGUID = this.state.franchiseList[idx].UserGUID
        this.setState(updated)

    }

    viewMerchant = (idx) => {
        let updated = Object.assign({}, this.state);
        updated.franListOpenPop[idx] = false;
        updated.tab = 2;
        updated.UserGUID = this.state.franchiseList[idx].UserGUID
        this.setState(updated)
    }

    action = (e, idx) => {

        e.preventDefault();
        let updated = Object.assign({}, this.state);
        updated.franListOpenPop[idx] = true;
        updated.franListAnEl[idx] = e.currentTarget;
        this.setState(updated)
    }

    addFranchise = () => {

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

        apiManager.opayApi(opay_url + admin_create_franchise, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                    this.handleTouchTap(`${res.data.Message}`, false);
                } else if (res.data.Confirmation === 'Success') {
                    this.setState({ modalOpen: false });
                    this.handleTouchTap(`Franchise has been added`, true);
                    this.getFranchiseList(this.state.currentPage);// may have problem when the current page contains 10 item
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
        });
    }

    getFranchiseList = (page) => {

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

        apiManager.opayApi(opay_url + admin_franchise_list, params, true).then((res) => {

            if (res.data) {

                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {
                    let FranchisesList = res.data.Response.UserList;
                    for (let franchise of FranchisesList) {
                        franchise.CreatedAt = franchise.CreatedAt ? moment(franchise.CreatedAt).format('YYYY-MM-DD HH:mm:ss') : '';
                    }

                    this.setState({
                        currentPage: page,
                        franchiseList: FranchisesList,
                        totalRecords: res.data.Response.TotalRecords
                    });
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
        this.setState({modalOpen: false, addFranchiseModalOpen: false});
    }

    renderTab = (tab) => {

        const {
            tableCellStyle,
            formControl,
            btnControl,
            sideBtnContainer,
            addMerchantBtn,
            tableCardContainer
        } = styles;

        switch(tab) {

            case 1: return (
                <AddMerchant UserGUID={this.state.UserGUID} OnBack={() => this.handleBackToList()}/>
            );
            case 2: return (
                <ViewMerchant UserGUID={this.state.UserGUID} OnBack={() => this.handleBackToList()} />
            );
            default: return (
                <MuiThemeProvider>
                    <div>
                        <div style={sideBtnContainer}>
                            <div style={addMerchantBtn}>
                                <RaisedButton label="Add" primary={true} onClick={this.openDialog}/>
                            </div>
                        </div>
                        <Card style={tableCardContainer}>
                            <Table>
                                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                    <TableRow>
                                        {this.state.tableField.map((item) => (
                                            <TableHeaderColumn style={tableCellStyle}>{item}</TableHeaderColumn>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false}>
                                    {this.state.franchiseList.map((franchise, idx) => (
                                        <TableRow key={idx} selectable={false}>
                                            <TableRowColumn style={tableCellStyle}>{franchise.AgentID}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{franchise.FirstName + ' ' + franchise.LastName}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{franchise.Email}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{franchise.Status}</TableRowColumn>
                                            <TableRowColumn style={tableCellStyle}>{<div style={{textAlign: 'center'}}>
                                                <RaisedButton
                                                    onClick={(e) => this.action(e, idx)}
                                                    primary={true}
                                                    label='Action'
                                                />
                                                <Popover
                                                    onRequestClose={(e, idx) => this.handleRequestClose(idx)}
                                                    open={this.state.franListOpenPop[idx]}
                                                    anchorEl={this.state.franListAnEl[idx]}
                                                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                    animation={PopoverAnimationVertical}>
                                                    <Menu>
                                                        <MenuItem primaryText="Add Merchant" onClick={() => this.addMerchant(idx)}/>
                                                        <MenuItem primaryText="View" onClick={() => this.viewMerchant(idx)}/>
                                                    </Menu>
                                                </Popover>
                                            </div>}</TableRowColumn>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        <div style={{textAlign: 'right', paddingRight: 12, paddingVertical: 12}}>
                            <Pagination
                                total={Math.ceil(this.state.totalRecords / parseInt(this.state.Limit))}
                                current={this.state.currentPage}
                                display={this.state.display}
                                onChange={currentPage => this.handleChangePage(currentPage)}
                            />
                        </div>

                        <Dialog title="Add Franchise" modal={false} open={this.state.modalOpen}
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
                                    <RaisedButton label="Add" primary={true} onClick={this.addFranchise}/>
                                </div>
                            </div>
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
            );
        }
    }

    render() {

        return (
            <div>
                {this.renderTab(this.state.tab)}
            </div>
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
    },

    sideBtnContainer: {
        height: 36,
        marginTop: 24,
    },

    addMerchantBtn: {
        float: 'right',
        height: 36,
    },

    tableCardContainer: {
        width: 'calc(100% - 48px)',
        margin: '0 auto',
        marginTop: 24
    },
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default Franchise;