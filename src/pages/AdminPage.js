import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import UltimatePagination from 'react-ultimate-pagination-material-ui';

import { showSnackbar }  from '../actions/layout_action';
import { root_page } from '../utilities/urlPath'
import { opay_url, admin_merchantlist, admin_logout, admin_active_merchant } from "../utilities/apiUrl";
import * as apiManager from  '../helpers/apiManager';


class AdminPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            showPagination: false, currentPage: 1, totalPages: 1, boundaryPagesRange: 1,
            siblingPagesRange: 1, hidePreviousAndNextPageLinks: false, start: 0, end: 9,
            hideFirstAndLastPageLinks: false, hideEllipsis: false,
            merListOpenPop: [false, false, false],
            merListAnEl: [null,null,null],
            merListTitle: ['AgentID', 'Name', 'Email', 'Phone', 'CreatedAt', 'Status', 'Action'],
            merList: [{ AgentID: 'aaaaaaaaaaaaaaaaaaaa', FirstName: 'aaaaaaaaaaaaaaaaaaaa', Email: 'aaaaaaaaaaaaaaaaaaaa', PhoneNumber: 'aaaaaaaaaaaaaaaaaaaa', CreatedAt: 'aaaaaaaaaaaaaaaaaaaa', Status:'ACTIVE' },
                { AgentID: 'aaaaaaaaaaaaaaaaaaaa', FirstName: 'aaaaaaaaaaaaaaaaaaaa', Email: 'aaaaaaaaaaaaaaaaaaaa', PhoneNumber: 'aaaaaaaaaaaaaaaaaaaa', CreatedAt: 'aaaaaaaaaaaaaaaaaaaa', Status:'INACTIVE' },
                { AgentID: 'aaaaaaaaaaaaaaaaaaaa', FirstName: 'aaaaaaaaaaaaaaaaaaaa', Email: 'aaaaaaaaaaaaaaaaaaaa', PhoneNumber: 'aaaaaaaaaaaaaaaaaaaa', CreatedAt: 'aaaaaaaaaaaaaaaaaaaa', Status:'ACTIVE' }]
        }

        this.logout = this.logout.bind(this);
        this.getMerList = this.getMerList.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.active = this.active.bind(this);
        this.onPageChangeFromPagination = this.onPageChangeFromPagination.bind(this);

        this.getMerList();

    }

    getMerList = () => {

        let params = { Params: { Limit: "-1", Offset: "0" } };// Limit: -1 means return all results

        apiManager.opayApi(opay_url + admin_merchantlist, params,true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {

                    let total = res.data.Response.TotalRecords;
                    let numberOfPage = Math.floor(total / 10.0);

                    if(total % 10 > 0) {
                        numberOfPage += 1;
                    }
                    let end = total > 10 ? 9 : total;
                    this.setState({ totalPages: numberOfPage, start: 0, end: end });

                    let list = res.data.Response.Merchants;

                    this.setState({ merList: list })
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

        /*
        {
    "Confirmation": "Success",
    "Response": {
        "UserGUID": "d50d5845-cece-486d-83be-15309470cb81",
        "FirstName": "jiamin Test",
        "LastName": "legal",
        "UserTypeID": 2,
        "Email": "jiamin.ning@opay.ca",
        "PhoneNumber": "1234567890",
        "CountryCode": "1",
        "TaxNumber": "1234567890",
        "Status": "ACTIVE",
        "IsVerified": 1,
        "AgentID": "2153250942",
        "CreatedAt": "2017-11-17T15:41:09.000Z"
    }
}
        * */

        let params = { Params: { UserGUID: this.state.merList[idx].UserGUID } };

        apiManager.opayApi(opay_url + admin_active_merchant, params, true).then((res) => {

            if (res.data) {
                if (res.data.Confirmation === 'Fail') {
                } else if (res.data.Confirmation === 'Success') {
                    let list = [];
                    for (let i = 0;i < this.state.merList.length;i++) {
                        list.push(this.state.merList[i]);
                    }
                    this.setState({ merList: list });
                }
            }

        }).catch((err) => {
            localStorage.removeItem('token');
            browserHistory.push(`${root_page}`);
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
        // This prevents ghost click.
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
        this.getMerList();
    }


    render() {

        const {
            mainPageStyle,
            tableCellStyle
        } = styles;

        return (
            <MuiThemeProvider>
                <div style={mainPageStyle}>

                    <div>
                        <Drawer open={true} width={150}>
                            <MenuItem primaryText="Merchants" />
                            <MenuItem primaryText="Log out" onClick={this.logout} />
                        </Drawer>
                    </div>

                    <div style={{ marginLeft: '160px', marginRight: '10px' }}>
                        <Table>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    {this.state.merListTitle.map((item) => (
                                        <TableHeaderColumn style={tableCellStyle}>{item}</TableHeaderColumn>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {this.state.merList.slice(this.state.start,this.state.end).map((msg, idx)=>(
                                    <TableRow selectable={false}>
                                        <TableRowColumn style={tableCellStyle}>{msg.AgentID}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.FirstName}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.Email}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.PhoneNumber}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.CreatedAt}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}>{msg.Status}</TableRowColumn>
                                        <TableRowColumn style={tableCellStyle}><div style={{textAlign: 'center'}}>
                                            <RaisedButton
                                                onClick={msg.Status === 'ACTIVE' ? (e) => this.handleAction(e, idx) : () => this.active(idx)}
                                                secondary={msg.Status !== 'ACTIVE'}
                                                label={msg.Status === 'ACTIVE' ? 'ACTION' : 'ACTIVE'}
                                            />
                                            { msg.Status === 'INACTIVE' ? '' : <Popover
                                                onRequestClose={(e, idx) => this.handleRequestClose(idx)}
                                                open={this.state.merListOpenPop[idx]}
                                                anchorEl={this.state.merListAnEl[idx]}
                                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                animation={PopoverAnimationVertical}>
                                                <Menu>
                                                    <MenuItem primaryText="Add POS" />
                                                    <MenuItem primaryText="Set" />
                                                </Menu>
                                            </Popover> }
                                        </div></TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div style={{ textAlign: 'center' }}><UltimatePagination
                            currentPage={this.state.currentPage}
                            totalPages={this.state.totalPages}
                            boundaryPagesRange={this.state.boundaryPagesRange}
                            siblingPagesRange={this.state.siblingPagesRange}
                            hidePreviousAndNextPageLinks={this.state.hidePreviousAndNextPageLinks}
                            hideFirstAndLastPageLinks={this.state.hideFirstAndLastPageLinks}
                            hideEllipsis={this.state.hideEllipsis}
                            onChange={this.onPageChangeFromPagination}
                        /></div>

                    </div>
                </div>
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
        wordWrap: 'break-word'
    }

}

export default connect()(AdminPage);